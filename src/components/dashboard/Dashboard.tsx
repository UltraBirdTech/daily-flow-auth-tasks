
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, Task } from '@/contexts/TaskContext';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';
import CategoryForm from '../tasks/CategoryForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, LogOutIcon, TagIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, categories } = useTask();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  const openTaskForm = () => {
    setEditTask(undefined);
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditTask(task);
    setIsTaskFormOpen(true);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-todo-purple">ToDoリスト</h1>
            <p className="text-gray-500 text-sm">{user?.name}さん、こんにちは！</p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={logout}
          >
            <LogOutIcon className="h-4 w-4" />
            ログアウト
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl p-4 pt-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-gray-500">総タスク数</span>
              <span className="text-2xl font-bold">{tasks.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-gray-500">完了済み</span>
              <span className="text-2xl font-bold text-green-600">{completedTasks}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-gray-500">未完了</span>
              <span className="text-2xl font-bold text-amber-600">{pendingTasks}</span>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">カテゴリー</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsCategoryFormOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              <span>カテゴリー追加</span>
            </Button>
          </div>
          
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  style={{
                    backgroundColor: category.color,
                    color: 'white',
                  }}
                  className="px-3 py-1"
                >
                  <TagIcon className="h-3 w-3 mr-1 inline" />
                  {category.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">カテゴリーはまだありません</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Task List */}
        <TaskList onAddTask={openTaskForm} onEditTask={openEditTaskForm} />
      </div>

      {/* Task Form Dialog */}
      <TaskForm 
        open={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
        editTask={editTask}
      />

      {/* Category Form Dialog */}
      <CategoryForm 
        open={isCategoryFormOpen} 
        onClose={() => setIsCategoryFormOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
