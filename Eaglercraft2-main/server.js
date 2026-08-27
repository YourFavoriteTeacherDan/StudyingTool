import express from 'express';

const app = express();
const port = 3001;

app.use(express.json());

let messages = [];

app.get('/api/forums', (req, res) => {
  res.json(messages);
});

app.post('/api/forums', (req, res) => {
  const { message } = req.body;
  if (message) {
    const newMessage = {
      id: messages.length + 1,
      message,
      comments: [],
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
  } else {
    res.status(400).json({ error: 'Message is required' });
  }
});

app.post('/api/forums/:id/comments', (req, res) => {
    const messageId = parseInt(req.params.id, 10);
    const { comment } = req.body;
    const message = messages.find((m) => m.id === messageId);

    if (message && comment) {
        const newComment = {
            text: comment,
            timestamp: new Date().toISOString(),
        };
        message.comments.push(newComment);
        res.status(201).json(newComment);
    } else {
        res.status(404).json({ error: 'Message not found or comment is empty' });
    }
});


app.delete('/api/forums/:id', (req, res) => {
    const messageId = parseInt(req.params.id, 10);
    messages = messages.filter((m) => m.id !== messageId);
    res.status(204).send();
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
