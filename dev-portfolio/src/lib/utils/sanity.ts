import { createClient, type ClientConfig } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url'

const config: ClientConfig = {
    projectId: "9ae025s2",
    dataset: "production",
    useCdn: false, // v PROD = true
    apiVersion: "2025-04-21",
}

const sanityClient = createClient(config);
export default sanityClient;

export function processProjectEntries(rawProject: SanityProject) {
    const builder = imageUrlBuilder(sanityClient);
    const projectImageUrl = builder.image(rawProject.image).url();
    const processedProject: ProcessedProject = {
        name: rawProject.name,
        company: rawProject.company,
        dateAccomplished: rawProject.dateAccomplished,
        stack: rawProject.stack,
        slug: rawProject.slug,
        projectImageUrl,
        content: rawProject.content.map(processProjectContent)
    }

    return processedProject;
}

function processProjectContent(content: RawTextContent | RawImageContent) {
    if (content._type === "block") {
        const processedTextContent: ProcessedTextContent = {
            type: "text",
            style: content.style,
            textToRender: content.children.map(elem => elem.text).join("\n"),
        };
        return processedTextContent;
    } else {
        const builder = imageUrlBuilder(sanityClient);
        const projectImageUrl = builder.image(content).url();

        const processedImageContent: ProcessedImageContent = {
            type: "image",
            url: projectImageUrl
        }

        return processedImageContent;
    }
}