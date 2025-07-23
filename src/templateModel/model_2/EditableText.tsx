import React, { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWeddingAuth } from '@/contexts/WeddingAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EditableTextProps {
  children: React.ReactNode;
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  editClassName?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  children,
  value,
  onSave,
  multiline = false,
  className = '',
  editClassName = ''
}) => {
  const { isLoggedIn: isAuthenticated } = useWeddingAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  if (!isAuthenticated) {
    return <div className={className}>{children}</div>;
  }

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute -top-2 -right-2 opacity-80 hover:opacity-100 z-10"
          onClick={() => setIsEditing(true)}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      )}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full ${editClassName}`}
              rows={4}
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full ${editClassName}`}
              autoFocus
            />
          )}
          <DialogFooter className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
