
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, Plus, LogOut, RefreshCw } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';

interface TodoListProps {
  user: User;
  onLogout: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ user, onLogout }) => {
  const [newTodo, setNewTodo] = useState('');
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo, refetch } = useTodos(user.id);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Daily Flow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">ようこそ、{user.email}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>新しいタスクを追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="新しいタスクを入力..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo} disabled={!newTodo.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              タスク ({completedCount}/{totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500 text-center py-8">
                読み込み中...
              </p>
            ) : todos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                まだタスクがありません。上から追加してください！
              </p>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)}
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodoList;
