import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminError, AdminLoading } from "../../components/admin/AdminState";
import { createAdminProject, deleteAdminProjectImage, getAdminProject, getMaterials, setAdminProjectPublished, updateAdminProject, uploadAdminProjectImages } from "../../lib/api";

const empty = { title: "", carModel: "", yearModel: "", materialId: "", description: "", published: false };
const maxYear = new Date().getFullYear() + 1;
const imageTypes = ["BEFORE", "AFTER", "GALLERY"];
const labelForType = (type) => type.charAt(0) + type.slice(1).toLowerCase();

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [materials, setMaterials] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageType, setImageType] = useState("GALLERY");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [message, setMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const results = await Promise.all([getMaterials(), isNew ? Promise.resolve(null) : getAdminProject(id)]);
      setMaterials(results[0].data || []);
      if (results[1]) {
        const project = results[1].data;
        setForm({ title: project.title || "", carModel: project.carModel || "", yearModel: project.yearModel || "", materialId: project.materialId || "", description: project.description || "", published: project.published });
        setImages(project.projectImages || []);
      }
    } catch { setError(true); } finally { setLoading(false); }
  }, [id, isNew]);

  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer); }, [load]);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const payload = () => ({ title: form.title.trim(), carModel: form.carModel.trim() || null, yearModel: form.yearModel ? Number(form.yearModel) : null, materialId: form.materialId || null, description: form.description.trim() || null, published: form.published });

  async function save(event) {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const response = isNew ? await createAdminProject(payload()) : await updateAdminProject(id, payload());
      setMessage("Project saved.");
      if (isNew) navigate(`/admin/projects/${response.data.id}`, { replace: true });
    } catch (requestError) { setMessage(requestError.status === 422 ? "Please check the required project details." : "We couldn't save this project. Please try again."); }
    finally { setSaving(false); }
  }

  async function togglePublish() {
    if (isNew) return;
    setSaving(true); setMessage("");
    try { const response = await setAdminProjectPublished(id, !form.published); setForm((current) => ({ ...current, published: response.data.published })); setMessage(response.data.published ? "Project published." : "Project returned to draft."); }
    catch { setMessage("We couldn't update publishing. Please try again."); } finally { setSaving(false); }
  }

  function chooseFiles(event) {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setImageMessage(files.length ? "" : "Choose one or more image files to upload.");
  }

  async function uploadImages(event) {
    event.preventDefault();
    if (!selectedFiles.length || uploading) return;
    setUploading(true); setImageMessage("");
    const data = new FormData();
    data.append("imageType", imageType);
    selectedFiles.forEach((file) => data.append("images", file));
    try {
      const response = await uploadAdminProjectImages(id, data);
      setImages((current) => [...(response.data || []), ...current]);
      setSelectedFiles([]);
      event.currentTarget.reset();
      setImageMessage("Images uploaded successfully.");
    } catch (requestError) {
      setImageMessage(requestError.status === 422 ? "Please use JPG, PNG, or WEBP files smaller than 8 MB." : "We couldn't upload these images. Please try again.");
    } finally { setUploading(false); }
  }

  async function removeImage(image) {
    if (removingId || !window.confirm("Delete this project image permanently?")) return;
    setRemovingId(image.id); setImageMessage("");
    try { await deleteAdminProjectImage(id, image.id); setImages((current) => current.filter((currentImage) => currentImage.id !== image.id)); setImageMessage("Image deleted."); }
    catch { setImageMessage("We couldn't delete this image. Please try again."); } finally { setRemovingId(""); }
  }

  if (loading) return <AdminLoading label="Loading project..." />;
  if (error) return <AdminError onRetry={load} message="We couldn't load the project editor." />;
  return <section>
    <Link to="/admin/projects" className="text-sm font-bold text-zinc-400 hover:text-white">← Back to projects</Link>
    <h1 className="mt-5 text-[clamp(2rem,6vw,2.5rem)] font-black">{isNew ? "ADD PROJECT" : "EDIT PROJECT"}</h1>
    <form onSubmit={save} className="mt-8 max-w-3xl space-y-5 rounded-xl border border-white/10 bg-black p-5 sm:p-7">
      <label className="block text-sm font-bold">Project title<input required maxLength="160" value={form.title} onChange={(event) => change("title", event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 outline-none focus:border-red-500" /></label>
      <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-bold">Car model<input maxLength="120" value={form.carModel} onChange={(event) => change("carModel", event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 outline-none focus:border-red-500" /></label><label className="block text-sm font-bold">Year model<input type="number" min="1900" max={maxYear} value={form.yearModel} onChange={(event) => change("yearModel", event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 outline-none focus:border-red-500" /></label></div>
      <label className="block text-sm font-bold">Material<select value={form.materialId} onChange={(event) => change("materialId", event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 outline-none focus:border-red-500"><option value="">No material selected</option>{materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}</select></label>
      <label className="block text-sm font-bold">Description<textarea maxLength="2000" value={form.description} onChange={(event) => change("description", event.target.value)} className="mt-2 min-h-32 w-full rounded-lg border border-white/10 bg-zinc-900 p-3 outline-none focus:border-red-500" /></label>
      <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => change("published", event.target.checked)} /> Publish this project</label>
      {message ? <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-200" role="status">{message}</p> : null}
      <div className="flex flex-wrap gap-3"><button disabled={saving} className="min-h-11 rounded-lg bg-red-500 px-5 text-sm font-black text-white disabled:opacity-60">{saving ? "SAVING..." : "SAVE CHANGES"}</button>{!isNew ? <button type="button" disabled={saving} onClick={togglePublish} className="min-h-11 rounded-lg border border-white/15 px-5 text-sm font-black text-white disabled:opacity-60">{form.published ? "UNPUBLISH" : "PUBLISH"}</button> : null}</div>
    </form>

    {!isNew ? <section className="mt-8 max-w-5xl rounded-xl border border-white/10 bg-black p-5 sm:p-7"><div><h2 className="text-xl font-black">PROJECT IMAGES</h2><p className="mt-1 text-sm text-zinc-400">Upload JPG, PNG, or WEBP files up to 8 MB each. Up to 6 images per upload.</p></div><form onSubmit={uploadImages} className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-zinc-950 p-4 md:grid-cols-[minmax(0,1fr)_12rem_auto] md:items-end"><label className="block text-sm font-bold">Image type<select value={imageType} disabled={uploading} onChange={(event) => setImageType(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 outline-none focus:border-red-500">{imageTypes.map((type) => <option key={type} value={type}>{labelForType(type)}</option>)}</select></label><label className="block text-sm font-bold">Choose images<input required multiple accept="image/jpeg,image/png,image/webp" disabled={uploading} type="file" onChange={chooseFiles} className="mt-2 block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-bold file:text-white hover:file:bg-white/20" /></label><button disabled={uploading || !selectedFiles.length} className="min-h-11 rounded-lg bg-red-500 px-5 text-sm font-black text-white disabled:opacity-60">{uploading ? "UPLOADING..." : "UPLOAD"}</button></form>{selectedFiles.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{selectedFiles.map((file) => <div key={`${file.name}-${file.lastModified}`} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900"><img src={URL.createObjectURL(file)} alt="Selected upload preview" className="aspect-square w-full object-cover" /><p className="truncate p-2 text-xs text-zinc-400">{file.name}</p></div>)}</div> : null}{imageMessage ? <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-200" role="status">{imageMessage}</p> : null}<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.length ? images.map((image) => <article key={image.id} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900"><img src={image.imageUrl} alt={`${labelForType(image.imageType)} project image`} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="flex items-center justify-between gap-3 p-3"><span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-black text-red-300">{labelForType(image.imageType)}</span><button type="button" disabled={removingId === image.id || uploading} onClick={() => removeImage(image)} className="text-xs font-black text-zinc-300 hover:text-red-400 disabled:opacity-60">{removingId === image.id ? "DELETING..." : "DELETE"}</button></div></article>) : <p className="rounded-lg border border-dashed border-white/15 p-5 text-sm text-zinc-400 sm:col-span-2 lg:col-span-3">No project images yet.</p>}</div></section> : null}
  </section>;
}