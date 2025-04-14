
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
}

// Predefined colors
const colorOptions = [
  { name: 'パープル', value: '#9b87f5' },
  { name: 'ブルー', value: '#0EA5E9' },
  { name: 'グリーン', value: '#10B981' },
  { name: 'イエロー', value: '#F59E0B' },
  { name: 'オレンジ', value: '#F97316' },
  { name: 'レッド', value: '#EF4444' },
  { name: 'ピンク', value: '#EC4899' },
];

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onClose }) => {
  const { addCategory } = useTask();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      addCategory(name.trim(), selectedColor);
      onClose();
      setName('');
      setSelectedColor(colorOptions[0].value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>新しいカテゴリー</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="カテゴリー名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>色</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full ${
                      selectedColor === color.value ? 'ring-2 ring-black' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-todo-purple hover:bg-todo-darkPurple">
              追加
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
