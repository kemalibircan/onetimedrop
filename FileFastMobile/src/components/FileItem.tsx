import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../theme';
import { SavedFile } from '../storage/fileStore';

function fileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '🗜️';
  if (mimeType.startsWith('text/')) return '📃';
  return '📎';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

interface FileItemProps {
  file: SavedFile;
  onRemove?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
  uploadStatus?: 'idle' | 'uploading' | 'done' | 'error';
  progress?: number;
}

export default function FileItem({
  file,
  onRemove,
  selectable = false,
  selected = false,
  onToggle,
  uploadStatus = 'idle',
  progress = 0,
}: FileItemProps) {
  const statusIcon = {
    idle: null,
    uploading: '⏳',
    done: '✅',
    error: '❌',
  }[uploadStatus];

  return (
    <TouchableOpacity
      onPress={() => selectable && onToggle?.(file.id)}
      activeOpacity={selectable ? 0.7 : 1}
      style={[styles.container, selected && styles.selected]}
    >
      {selectable && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      <Text style={styles.icon}>{fileIcon(file.mimeType)}</Text>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
        <Text style={styles.size}>{formatBytes(file.size)}</Text>
        {uploadStatus === 'uploading' && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>

      {statusIcon && <Text style={styles.statusIcon}>{statusIcon}</Text>}

      {onRemove && uploadStatus === 'idle' && (
        <TouchableOpacity
          onPress={() => onRemove(file.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.removeBtn}
        >
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}08`,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  checkboxSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  icon: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  size: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  statusIcon: {
    fontSize: 18,
  },
  removeBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.error}15`,
    borderRadius: 8,
  },
  removeText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
});
