import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Paper, Button, Chip, Avatar, CircularProgress, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '' });
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState('');
  const [members, setMembers] = useState([]);
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [attachments, setAttachments] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState({});

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
  }

  const statusList = [
    { key: 'todo', label: 'To Do', color: 'default' },
    { key: 'inprogress', label: 'In Progress', color: 'info' },
    { key: 'done', label: 'Done', color: 'success' }
  ];

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      navigate('/login', { replace: true });
      return;
    }
    fetchProject();
    // eslint-disable-next-line
  }, [id]);

  async function fetchProject() {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProject(res.data.project);
      setTasks(res.data.tasks);
      setMembers(res.data.members || []);
      for (const t of res.data.tasks) {
        fetchComments(t.id);
        fetchAttachments(t.id);
      }
    } catch (err) {
      setError('Failed to load project');
    }
    setLoading(false);
  }

  async function fetchComments(taskId) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/comments/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments(c => ({ ...c, [taskId]: res.data }));
    } catch {}
  }

  async function postComment(taskId) {
    if (!commentInputs[taskId]) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/comments/${taskId}`, { content: commentInputs[taskId] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCommentInputs(ci => ({ ...ci, [taskId]: '' }));
      fetchComments(taskId);
    } catch {}
  }

  async function fetchAttachments(taskId) {
    try {
      const t = tasks.find(t => t.id === taskId);
      setAttachments(a => ({ ...a, [taskId]: t?.attachments || [] }));
    } catch {}
  }

  async function uploadAttachment(taskId, file) {
    if (!file) return;
    setUploading(u => ({ ...u, [taskId]: true }));
    setUploadSuccess(s => ({ ...s, [taskId]: false }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/attachments/${taskId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchAttachments(taskId);
      setUploadSuccess(s => ({ ...s, [taskId]: true }));
      setTimeout(() => setUploadSuccess(s => ({ ...s, [taskId]: false })), 2000);
    } catch {}
    setUploading(u => ({ ...u, [taskId]: false }));
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(tasks => tasks.map(t => t.id === Number(taskId) ? { ...t, status: newStatus } : t));
    } catch (err) {
      setError('Failed to update task status');
    }
  }

  function handleOpen() { setOpen(true); setError(''); setSuccess(''); }
  function handleClose() { setOpen(false); setNewTask({ title: '', description: '' }); }

  async function handleCreateTask(e) {
    e.preventDefault();
    setCreating(true); setError(''); setSuccess('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${id}`, newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks([...tasks, res.data]);
      setSuccess('Task created!');
      handleClose();
    } catch (err) {
      setError('Failed to create task');
    }
    setCreating(false);
  }

  return (
      <Box sx={{ width: '100vw', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e9f7 100%)', pb: 6, overflowX: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            {/* Header Section */}
            <Box sx={{ width: '100%', background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)', color: 'white', borderRadius: 1, boxShadow: 2, mb: 4, py: { xs: 3, sm: 4 }, px: { xs: 4, sm: 10, md: 16, lg: 24 } }}>
              <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1, fontSize: { xs: 22, sm: 28, md: 34 } }}>{project?.name}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, fontSize: { xs: 13, sm: 16 } }}>{project?.description}</Typography>

            </Box>
            {/* Filters & Actions */}
            <Box mt={-2} mb={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" px={{ xs: 4, sm: 10, md: 16, lg: 24 }}>
              <Box display="flex" gap={2} flex={1}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="filter-assignee-label">Filter by Assignee</InputLabel>
                  <Select
                    labelId="filter-assignee-label"
                    value={filterAssignee || ''}
                    label="Filter by Assignee"
                    onChange={e => setFilterAssignee(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {members.map(m => (
                      <MenuItem key={m.user.id} value={m.user.id}>{m.user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="filter-status-label">Filter by Status</InputLabel>
                  <Select
                    labelId="filter-status-label"
                    value={filterStatus || ''}
                    label="Filter by Status"
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statusList.map(s => (
                      <MenuItem key={s.key} value={s.key}>{s.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button variant="contained" color="primary" onClick={handleOpen} sx={{ fontWeight: 700, px: 3, boxShadow: 1, borderRadius: 2, mt: { xs: 2, sm: 0 } }}>+ New Task</Button>
            </Box>
            {/* Alerts */}
            <Box px={{ xs: 4, sm: 10, md: 16, lg: 24 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            </Box>
            {/* Kanban Board */}
            <Box px={0} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 1800, px: { xs: 2, sm: 6, md: 10, lg: 16, xl: 24 } }}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" alignItems="stretch">
                    {(filterStatus
                      ? statusList.filter(s => s.key === filterStatus)
                      : statusList
                    ).map(status => (
                      <Grid item xs={12} sm={6} md={4} key={status.key}>
                        <Paper sx={{ p: { xs: 1, sm: 2 }, minHeight: { xs: 220, sm: 320, md: 400 }, background: 'rgba(240,248,255,0.97)', borderRadius: 1.5, boxShadow: 3, display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                          <Typography variant="h6" fontWeight={800} gutterBottom sx={{ fontSize: { xs: 15, sm: 18, md: 20 }, color: '#1565c0', letterSpacing: 0.5 }}>
                            {status.label} <Chip label={status.label} color="primary" size="small" sx={{ ml: 1, background: '#1976d2', color: 'white' }} />
                          </Typography>
                          <Droppable droppableId={status.key}>
                            {(provided) => (
                              <Box ref={provided.innerRef} {...provided.droppableProps} minHeight={{ xs: 100, sm: 180, md: 350 }} sx={{ transition: 'min-height 0.2s', pb: 1 }}>
                                {tasks.filter(t =>
                                  t.status === status.key &&
                                  (!filterAssignee || String(t.assigneeId) === String(filterAssignee)) &&
                                  (!filterStatus || t.status === filterStatus)
                                ).map((task, idx) => (
                                  <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                                    {(provided) => (
                                      <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ p: { xs: 1, sm: 2 }, mb: 2, borderLeft: `5px solid #1976d2`, boxShadow: { xs: 1, sm: 2 }, fontSize: { xs: 13, sm: 15 }, borderRadius: 1, background: '#e3f2fd', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
                                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                                          <Box sx={{ width: '100%' }}>
                                            <Typography fontWeight={700} sx={{ fontSize: { xs: 14, sm: 16 }, color: '#222' }}>{task.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>{task.description}</Typography>
                                            <Box mt={1} display="flex" alignItems="center" gap={1}>
                                              {task.assignee && <Avatar sx={{ width: 24, height: 24, fontSize: 13 }}>{task.assignee.name[0]}</Avatar>}
                                              <Chip label={status.label} color="primary" size="small" sx={{ background: '#1976d2', color: 'white' }} />
                                            </Box>
                                            {/* Attachments */}
                                            <Box mt={1}>
                                              <Typography variant="caption" color="text.secondary">Attachments:</Typography>
                                              <Box display="flex" gap={1} flexWrap="wrap">
                                                {(attachments[task.id] || task.attachments || []).map(att => (
                                                  <Button key={att.id} size="small" href={att.url} target="_blank" rel="noopener noreferrer" sx={{ textTransform: 'none', fontSize: { xs: 11, sm: 13 } }}>
                                                    {att.filename}
                                                  </Button>
                                                ))}
                                              </Box>
                                              <Box mt={1}>
                                                <input
                                                  type="file"
                                                  style={{ display: 'none' }}
                                                  id={`file-upload-${task.id}`}
                                                  onChange={e => uploadAttachment(task.id, e.target.files[0])}
                                                  disabled={uploading[task.id]}
                                                />
                                                <label htmlFor={`file-upload-${task.id}`}>
                                                  <Button variant="outlined" size="small" component="span" disabled={uploading[task.id]} sx={{ fontSize: { xs: 11, sm: 13 } }}>
                                                    {uploading[task.id] ? 'Uploading...' : 'Upload File'}
                                                  </Button>
                                                </label>
                                                {uploadSuccess[task.id] && (
                                                  <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                                                    File uploaded!
                                                  </Typography>
                                                )}
                                              </Box>
                                            </Box>
                                            {/* Comments */}
                                            <Box mt={2}>
                                              <Typography variant="caption" color="text.secondary">Comments:</Typography>
                                              <Box sx={{ maxHeight: 90, overflowY: 'auto', mb: 1 }}>
                                                {(comments[task.id] || []).map(c => (
                                                  <Box key={c.id} display="flex" alignItems="center" gap={1} mb={0.5}>
                                                    <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>{c.user?.name?.[0] || '?'}</Avatar>
                                                    <Box>
                                                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: 11, sm: 13 } }}>{c.user?.name || 'User'}</Typography>
                                                      <Typography variant="caption" color="text.secondary">{formatDate(c.createdAt)}</Typography>
                                                      <Typography variant="body2" sx={{ fontSize: { xs: 11, sm: 13 } }}>{c.content}</Typography>
                                                    </Box>
                                                  </Box>
                                                ))}
                                              </Box>
                                              <Box display="flex" gap={1}>
                                                <TextField
                                                  size="small"
                                                  placeholder="Add a comment..."
                                                  value={commentInputs[task.id] || ''}
                                                  onChange={e => setCommentInputs(ci => ({ ...ci, [task.id]: e.target.value }))}
                                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); postComment(task.id); } }}
                                                  sx={{ flex: 1, fontSize: { xs: 11, sm: 13 } }}
                                                />
                                                <Button variant="contained" size="small" onClick={() => postComment(task.id)} sx={{ fontSize: { xs: 11, sm: 13 } }}>Post</Button>
                                              </Box>
                                            </Box>
                                          </Box>
                                          <Box display="flex" flexDirection={{ xs: 'row', sm: 'column' }} gap={1}>
                                            {/* Assignee or admin/manager can edit status */}
                                            {(() => {
                                              const userId = Number(localStorage.getItem('userId'));
                                              const currentUser = members.find(m => m.user.id === userId);
                                              const isAdminOrManager = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager');
                                              return (task.assigneeId === userId || isAdminOrManager);
                                            })() && (
                                              <IconButton size="small" color="info" onClick={() => setEditTask(task)}><EditIcon fontSize="small" /></IconButton>
                                            )}
                                            <IconButton size="small" color="error" onClick={async () => {
                                              try {
                                                await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${task.id}`, {
                                                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                                });
                                                setTasks(tasks => tasks.filter(t => t.id !== task.id));
                                              } catch (err) {
                                                setError('Failed to delete task');
                                              }
                                            }}><DeleteIcon fontSize="small" /></IconButton>
                                          </Box>
                                        </Box>
                                      </Paper>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </Box>
                            )}
                          </Droppable>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </DragDropContext>
              </Box>
            </Box>
            {/* New Task Dialog */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>New Task</DialogTitle>
              <DialogContent>
                <Box component="form" onSubmit={handleCreateTask} display="flex" flexDirection="column" gap={2}>
                  <TextField label="Title" value={newTask.title} onChange={e=>setNewTask({ ...newTask, title: e.target.value })} required />
                  <TextField label="Description" value={newTask.description} onChange={e=>setNewTask({ ...newTask, description: e.target.value })} required multiline minRows={2} />
                  <FormControl fullWidth sx={{ minWidth: 220 }}>
                    <InputLabel id="assignee-label">Assign To</InputLabel>
                    <Select
                      labelId="assignee-label"
                      value={newTask.assigneeId || ''}
                      label="Assign To"
                      onChange={e => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {members.map(m => (
                        <MenuItem key={m.user.id} value={m.user.id}>{m.user.name} ({m.role})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={creating}>Create</Button>
                  </DialogActions>
                </Box>
              </DialogContent>
            </Dialog>
            {/* Edit Task Dialog */}
            <Dialog open={!!editTask} onClose={() => setEditTask(null)}>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogContent>
                <Box component="form" onSubmit={async e => {
                  e.preventDefault();
                  try {
                    await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${editTask.id}`, editTask, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setTasks(tasks => tasks.map(t => t.id === editTask.id ? { ...t, ...editTask } : t));
                    setEditTask(null);
                  } catch (err) {
                    setError('Failed to update task');
                  }
                }} display="flex" flexDirection="column" gap={2}>
                  <TextField label="Title" value={editTask?.title || ''} onChange={e => setEditTask(et => ({ ...et, title: e.target.value }))} required />
                  <TextField label="Description" value={editTask?.description || ''} onChange={e => setEditTask(et => ({ ...et, description: e.target.value }))} required multiline minRows={2} />
                  <FormControl fullWidth sx={{ minWidth: 220 }}>
                    <InputLabel id="edit-assignee-label">Assign To</InputLabel>
                    <Select
                      labelId="edit-assignee-label"
                      value={editTask?.assigneeId ?? ''}
                      label="Assign To"
                      onChange={e => setEditTask(et => ({ ...et, assigneeId: e.target.value }))}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {members.map(m => (
                        <MenuItem key={m.user.id} value={m.user.id}>{m.user.name} ({m.role})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Assignee or admin/manager can change status, and show all valid status options */}
                  {(() => {
                    if (!editTask) return false;
                    const userId = Number(localStorage.getItem('userId'));
                    const currentUser = members.find(m => m.user.id === userId);
                    const isAdminOrManager = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager');
                    return (editTask.assigneeId === userId || isAdminOrManager);
                  })() && (
                    <FormControl fullWidth sx={{ minWidth: 220 }}>
                      <InputLabel id="edit-status-label">Status</InputLabel>
                      <Select
                        labelId="edit-status-label"
                        value={editTask.status}
                        label="Status"
                        onChange={e => setEditTask(et => ({ ...et, status: e.target.value }))}
                      >
                        {statusList.map(s => (
                          <MenuItem key={s.key} value={s.key}>{s.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <DialogActions>
                    <Button onClick={() => setEditTask(null)}>Cancel</Button>
                    <Button type="submit" variant="contained">Save</Button>
                  </DialogActions>
                </Box>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    );
}

export default ProjectDetail;
