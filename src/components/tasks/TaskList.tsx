import React, { useState } from 'react';
import { useTask, Task, Category } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  Trash2Icon, 
  PencilIcon,
  CheckCircle,
  Circle,
  ArrowUpCircle,
  AlertCircle,
  HelpCircle,
  DownloadIcon,
  FileIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  category: Category | undefined;
  onEdit: (task: Task) => void;
}

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'medium':
      return <ArrowUpCircle className="w-4 h-4 text-yellow-500" />;
    case 'low':
      return <HelpCircle className="w-4 h-4 text-green-500" />;
    default:
      return null;
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, category, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'task-priority-high';
      case 'medium':
        return 'task-priority-medium';
      case 'low':
        return 'task-priority-low';
      default:
        return '';
    }
  };

  return (
    <Card className={`mb-3 ${getPriorityClass()} animate-slide-in`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              className="mt-1"
            />
          </div>
          <div className={`flex-grow ${task.completed ? 'task-complete' : ''}`}>
            <div className="flex justify-between">
              <h3 className="font-medium text-base">{task.title}</h3>
              <div className="flex items-center gap-1">
                <PriorityIcon priority={task.priority} />
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => onEdit(task)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 hover:text-red-500" 
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {category && (
                <Badge 
                  style={{backgroundColor: category.color}} 
                  className="text-white"
                >
                  {category.name}
                </Badge>
              )}
              
              {task.dueDate && (
                <div className="text-xs flex items-center gap-1 text-gray-500">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    {format(new Date(task.dueDate), 'yyyy年MM月dd日', {locale: ja})}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskList: React.FC<{ onAddTask: () => void; onEditTask: (task: Task) => void }> = ({ onAddTask, onEditTask }) => {
  const { tasks, categories } = useTask();
  const [activeTab, setActiveTab] = useState<string>('all');

  const getCategoryById = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    return categories.find(category => category.id === categoryId);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'active') return !task.completed;
    return task.categoryId === activeTab;
  });

  const exportToCSV = (tasksToExport: Task[]) => {
    const headers = [
      '���イトル',
      '詳細',
      'ステータス',
      '優先度',
      'カテゴリー',
      '期限',
      '作成日'
    ].join(',');
    
    const csvRows = tasksToExport.map(task => {
      const category = getCategoryById(task.categoryId);
      const status = task.completed ? '完了' : '未完了';
      const priority = task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低';
      const dueDate = task.dueDate ? format(new Date(task.dueDate), 'yyyy年MM月dd日', {locale: ja}) : '';
      const createdAt = format(new Date(task.createdAt), 'yyyy年MM月dd日', {locale: ja});
      
      return [
        `"${task.title.replace(/"/g, '""')}"`, 
        `"${task.description.replace(/"/g, '""')}"`,
        `"${status}"`,
        `"${priority}"`,
        `"${category?.name || ''}"`,
        `"${dueDate}"`,
        `"${createdAt}"`
      ].join(',');
    });
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
    
    const fileName = `tasks_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSVファイルのダウンロードが完了しました');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">タスク一覧</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToCSV(tasks)}>
                <FileIcon className="mr-2 h-4 w-4" />
                <span>すべてのタスクをCSV出力</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV(filteredTasks)}>
                <FileIcon className="mr-2 h-4 w-4" />
                <span>表示中のタスクをCSV出力</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-todo-purple hover:bg-todo-darkPurple" onClick={onAddTask}>
            タスク追加
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-2">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="active">未完了</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
          <TabsTrigger value="categories" disabled>カテゴリー</TabsTrigger>
        </TabsList>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-3">
            {categories.map(category => (
              <Badge
                key={category.id}
                style={{
                  backgroundColor: activeTab === category.id ? category.color : 'transparent',
                  color: activeTab === category.id ? 'white' : 'inherit',
                  border: `1px solid ${category.color}`,
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab(category.id)}
                className="hover:bg-opacity-90"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        <TabsContent value="all" className="space-y-1">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                category={getCategoryById(task.categoryId)}
                onEdit={onEditTask} 
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">タスクはありません</p>
              <Button variant="link" onClick={onAddTask} className="mt-2 text-todo-purple">
                新しいタスクを追加
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-1">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                category={getCategoryById(task.categoryId)}
                onEdit={onEditTask} 
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">未完了のタスクはありません</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-1">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                category={getCategoryById(task.categoryId)}
                onEdit={onEditTask} 
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">完了したタスクはありません</p>
            </div>
          )}
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-1">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  category={getCategoryById(task.categoryId)}
                  onEdit={onEditTask} 
                />
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">このカテゴリーにはタスクがありません</p>
                <Button variant="link" onClick={onAddTask} className="mt-2 text-todo-purple">
                  新しいタスクを追加
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TaskList;
