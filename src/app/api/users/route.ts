export async function GET(request: Request) {
  return Response.json({ data: { foo: "bar" } });
}
