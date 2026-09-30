type ProjectScreenshotProps = {
  image: string;
  alt: string;
  caption?: string;
  lazy?: boolean;
};

export function ProjectScreenshot({ image, alt, caption, lazy = false }: ProjectScreenshotProps) {
  return <figure className="project-screenshot">
    <img src={image} alt={alt} loading={lazy ? "lazy" : "eager"} className="custom-project-image" />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}