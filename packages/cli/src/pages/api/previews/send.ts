import type { NextApiRequest, NextApiResponse } from "next";
import { error } from "../../../util/log";
import { sendMail } from "../../../moduleManifest";
import { getPreviewComponent } from "../../../util/moduleManifestUtil";
import { jsonStringifyError } from "../../../util/jsonStringifyError";

export default async function send(
  req: NextApiRequest,
  res: NextApiResponse<SendPreviewResponseBody>
) {
  if (req.method !== "POST" || !req.body) {
    res.writeHead(405).end();
    return;
  }

  const body: SendPreviewRequestBody = req.body;
  const { to, subject, previewClass, previewFunction } = body;
  let component;

  if (previewClass && previewFunction) {
    component = await getPreviewComponent(previewClass, previewFunction);
  }
  if (!component) {
    error("no component found");
    res.status(400).json({ error: "no html provided, no component found" });
    return;
  }

  try {
    await sendMail({
      component,
      to,
      dangerouslyForceDeliver: true,
      subject,
    });
    res.json({});
  } catch (e: any) {
    error("error sending mail", e);

    res
      .status(500)
      .json({ error: "sendMail threw an error: " + jsonStringifyError(e) });
  }
}
