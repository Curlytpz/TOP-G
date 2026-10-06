function MediaStack({ isOpen = false, onPhotoOpen, slots, variant }) {
  const isInteractive = typeof onPhotoOpen === "function";
  return (
    <div className={`tg-media-stack ${isOpen ? "is-open" : ""}`} data-gallery data-variant={variant}>
      {slots.map((slot, index) => {
        if (slot.isPlaceholder) return <div key={slot.alt} className="tg-media-photo tg-media-placeholder" data-photo={index} aria-hidden="true" />;
        if (isInteractive) return <button key={slot.alt} type="button" className="tg-media-photo" data-photo={index} onClick={() => onPhotoOpen(index)} aria-label={`Open ${slot.alt}`}><img src={slot.src} alt={slot.alt} loading="lazy" decoding="async" draggable="false" /></button>;
        return <div key={slot.alt} className="tg-media-photo" data-photo={index}><img src={slot.src} alt={slot.alt} loading="lazy" decoding="async" draggable="false" /></div>;
      })}
    </div>
  );
}

export default MediaStack;