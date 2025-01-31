import { useState } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Plus, Edit, Trash, Check } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string
  quadrant: 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'not-urgent-not-important'
  completed: boolean
}

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', quadrant: 'urgent-important' as Task['quadrant'] })
  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Math.random().toString(), completed: false }])
    setNewTask({ title: '', description: '', quadrant: 'urgent-important' })
    setIsAdding(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const toggleTaskCompletion = (task: Task) => {
    if (task.completed) {
      // Move back to active tasks
      setTasks([...tasks, { ...task, completed: false }])
      setArchivedTasks(archivedTasks.filter(t => t.id !== task.id))
    } else {
      // Move to archived tasks
      setArchivedTasks([...archivedTasks, { ...task, completed: true }])
      setTasks(tasks.filter(t => t.id !== task.id))
    }
  }

  const quadrants = [
    { id: 'urgent-important', title: 'Urgent & Important', color: 'bg-red-100' },
    { id: 'important-not-urgent', title: 'Important & Not Urgent', color: 'bg-blue-100' },
    { id: 'urgent-not-important', title: 'Urgent & Not Important', color: 'bg-yellow-100' },
    { id: 'not-urgent-not-important', title: 'Not Urgent & Not Important', color: 'bg-green-100' }
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Eisenhower Matrix</h1>
        
        <table className="w-full border-collapse mb-8">
          <tbody>
            <tr>
              <td className="p-2 border">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-red-600">Urgent & Important</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks
                      .filter(t => t.quadrant === 'urgent-important')
                      .map(task => (
                        <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={deleteTask} onToggleCompletion={toggleTaskCompletion} />
                      ))}
                    <AddTaskButton quadrant="urgent-important" onClick={() => {
                      setNewTask({ ...newTask, quadrant: 'urgent-important' })
                      setIsAdding(true)
                    }} />
                  </CardContent>
                </Card>
              </td>
              <td className="p-2 border">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Important & Not Urgent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks
                      .filter(t => t.quadrant === 'important-not-urgent')
                      .map(task => (
                        <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={deleteTask} onToggleCompletion={toggleTaskCompletion} />
                      ))}
                    <AddTaskButton quadrant="important-not-urgent" onClick={() => {
                      setNewTask({ ...newTask, quadrant: 'important-not-urgent' })
                      setIsAdding(true)
                    }} />
                  </CardContent>
                </Card>
              </td>
            </tr>
            <tr>
              <td className="p-2 border">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-yellow-600">Urgent & Not Important</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks
                      .filter(t => t.quadrant === 'urgent-not-important')
                      .map(task => (
                        <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={deleteTask} onToggleCompletion={toggleTaskCompletion} />
                      ))}
                    <AddTaskButton quadrant="urgent-not-important" onClick={() => {
                      setNewTask({ ...newTask, quadrant: 'urgent-not-important' })
                      setIsAdding(true)
                    }} />
                  </CardContent>
                </Card>
              </td>
              <td className="p-2 border">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-green-600">Not Urgent & Not Important</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks
                      .filter(t => t.quadrant === 'not-urgent-not-important')
                      .map(task => (
                        <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={deleteTask} onToggleCompletion={toggleTaskCompletion} />
                      ))}
                    <AddTaskButton quadrant="not-urgent-not-important" onClick={() => {
                      setNewTask({ ...newTask, quadrant: 'not-urgent-not-important' })
                      setIsAdding(true)
                    }} />
                  </CardContent>
                </Card>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Archived Tasks Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-gray-600">Archived Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {archivedTasks.length === 0 ? (
              <p className="text-gray-500">No archived tasks</p>
            ) : (
              archivedTasks.map(task => (
                <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={deleteTask} onToggleCompletion={toggleTaskCompletion} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Add Task Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addTask}>Add Task</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editingTask.description}
                      onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingTask(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => updateTask(editingTask)}>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskItem({ task, onEdit, onDelete, onToggleCompletion }: { 
  task: Task, 
  onEdit: (task: Task) => void, 
  onDelete: (id: string) => void,
  onToggleCompletion: (task: Task) => void 
}) {
  return (
    <div className={`p-4 mb-2 bg-white rounded-lg shadow-sm ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleCompletion(task)}
            className={`w-5 h-5 flex items-center justify-center border rounded mt-1 ${
              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}
          >
            {task.completed && <Check className="h-4 w-4 text-white" />}
          </button>
          <div>
            <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function AddTaskButton({ quadrant, onClick }: { quadrant: string, onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="w-full mt-2"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" /> Add Task
    </Button>
  )
}