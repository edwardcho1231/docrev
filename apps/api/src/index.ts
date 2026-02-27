import Express from 'express';
import cors from 'cors';

const app = Express();
app.use(cors());
app.use(Express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});