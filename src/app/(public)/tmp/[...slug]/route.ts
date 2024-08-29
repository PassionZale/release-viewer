import mime from "mime-types";
import fse, { ReadStream, Stats } from "fs-extra";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

// this api only for vercel `/tmp` folder

async function* nodeStreamToIterator(stream: ReadStream) {
  for await (const chunk of stream) {
    yield chunk;
  }
}

function iteratorToStream(iterator: any): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}

export function streamFile(path: string): ReadableStream {
  const downloadStream = fse.createReadStream(path);
  const data: ReadableStream = iteratorToStream(
    nodeStreamToIterator(downloadStream)
  );
  return data;
}

export async function GET(
  _: NextRequest,
  { params: { slug } }: { params: { slug: [string, string, string] } }
): Promise<NextResponse> {
  try {
    const fileName = slug[2];

    const filePath = path.join(process.cwd(), "/tmp", slug.join("/"));

    const mimeType = mime.lookup(fileName);

    if (!mimeType) throw new Error("请求不合法");

    const stats: Stats = await fse.stat(filePath);
    const data: ReadableStream<Uint8Array> = streamFile(filePath);
    const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
        "content-disposition": `attachment; filename=${fileName}`,
        "content-type": mimeType,
        "content-length": `${stats.size}`,
      }),
    });

    return res;
  } catch (error) {
    return new NextResponse("文件不存在", { status: 404 });
  }
}
