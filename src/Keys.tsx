import { useEffect, useMemo, useState } from 'react';
import { IItem } from './index';

interface KeysProps {
  initialData: IItem[];
  sorting: 'ASC' | 'DESC';
}

export function Keys({ initialData, sorting }: KeysProps) {
  const [items, setItems] = useState<IItem[]>(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState<string>('');

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) =>
      sorting === 'ASC' ? a.id - b.id : b.id - a.id
    );
  }, [items, sorting]);

  const handleStartEditing = (item: IItem) => {
    setEditingId(item.id);
    setDraftName(item.name);
  };

  const handleSave = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: draftName } : item))
    );
    setEditingId(null);
    setDraftName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setDraftName('');
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave(id);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
    }
  };

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>
          {editingId === item.id ? (
            <input
              type="text"
              value={draftName}
              autoFocus
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
            />
          ) : (
            <span onClick={() => handleStartEditing(item)}>{item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}