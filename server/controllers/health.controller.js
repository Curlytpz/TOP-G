export function getHealth(_request, response) {
  response.json({
    ok: true,
    service: "TOP-G Auto Seat API",
  });
}
