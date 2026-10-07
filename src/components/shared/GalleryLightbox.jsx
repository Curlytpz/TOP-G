import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function GalleryLightbox({ gallery, onClose, onSelect }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !gallery) return undefined;

    dialog.showModal();
    dialog.querySelector("button")?.focus();

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        onSelect((gallery.index - 1 + gallery.images.length) % gallery.images.length);
      }
      if (event.key === "ArrowRight") {
        onSelect((gallery.index + 1) % gallery.images.length);
      }
    };

    dialog.addEventListener("keydown", onKeyDown);

    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      if (dialog.open) dialog.close();
    };
  }, [gallery, onSelect]);

  if (!gallery) return null;

  const image = gallery.images[gallery.index];
  const hasMultiple = gallery.images.length > 1;

  return (
    <dialog
      ref={dialogRef}
      className="tg-lightbox"
      aria-label={`${gallery.title} photo gallery`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="tg-lightbox__frame">
        <button type="button" className="tg-lightbox__close" onClick={onClose} aria-label="Close image gallery"><X size={20} /></button>
        {hasMultiple ? <button type="button" className="tg-lightbox__previous" onClick={() => onSelect((gallery.index - 1 + gallery.images.length) % gallery.images.length)} aria-label="Previous photo"><ChevronLeft size={24} /></button> : null}
        <img key={image.src} className="tg-lightbox__image" src={image.src} alt={image.alt} draggable="false" />
        {hasMultiple ? <button type="button" className="tg-lightbox__next" onClick={() => onSelect((gallery.index + 1) % gallery.images.length)} aria-label="Next photo"><ChevronRight size={24} /></button> : null}
        <p>{image.alt}</p>
      </div>
    </dialog>
  );
}

export default GalleryLightbox;
