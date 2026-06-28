type Env = {
  STUDIO_SECRET?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestPost({
  request,
  env,
}: PagesContext) {
  const studioSecret = request.headers.get("x-studio-secret");

  if (!env.STUDIO_SECRET) {
    return Response.json(
      {
        success: false,
        error: "Studio secret is not configured.",
      },
      { status: 500 }
    );
  }

  if (studioSecret !== env.STUDIO_SECRET) {
    return Response.json(
      {
        success: false,
        error: "Invalid Studio secret.",
      },
      { status: 401 }
    );
  }

  return Response.json({
    success: true,
  });
}