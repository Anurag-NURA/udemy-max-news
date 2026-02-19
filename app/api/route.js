export function GET(req, res) {
  res.status(200).json({
    success: true,
    message: "News API is working",
  });
}
