import type { Product } from "@/lib/types";
import { videoEmbedUrl } from "@/lib/video";
import {
  addProductImagesAction,
  removeProductImageAction,
  setPrimaryImageAction,
  setProductVideoAction,
  removeProductVideoAction,
} from "@/app/admin/actions";

export default function ProductMedia({ product }: { product: Product }) {
  const { id, images, video } = product;
  const embed = video ? videoEmbedUrl(video) : null;

  return (
    <div className="admin-card admin-media">
      <div className="admin-card-head">
        <h2>Снимки</h2>
        <span className="admin-sub">Първата снимка е основна и се показва първа.</span>
      </div>

      {images.length > 0 ? (
        <div className="admin-media-grid">
          {images.map((src, i) => (
            <div className={`admin-media-item ${i === 0 ? "is-primary" : ""}`} key={src}>
              <img src={src} alt="" />
              {i === 0 && <span className="admin-media-badge">Основна</span>}
              <div className="admin-media-item-actions">
                {i !== 0 && (
                  <form action={setPrimaryImageAction}>
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="path" value={src} />
                    <button type="submit" title="Направи основна">★</button>
                  </form>
                )}
                <form action={removeProductImageAction}>
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="path" value={src} />
                  <button type="submit" title="Премахни" className="del">✕</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-empty">Още няма снимки. Качете една или няколко.</p>
      )}

      <form action={addProductImagesAction} className="admin-media-upload">
        <input type="hidden" name="id" value={id} />
        <input type="file" name="images" accept="image/*" multiple />
        <button className="btn btn-primary" type="submit">
          Добави снимки
        </button>
      </form>

      <div className="admin-card-head" style={{ marginTop: 26 }}>
        <h2>Видео</h2>
        <span className="admin-sub">По желание — линк към YouTube/Vimeo или качен файл.</span>
      </div>

      {video ? (
        <div className="admin-video-current">
          <div className="admin-video-preview">
            {embed ? (
              <iframe src={embed} title="Видео" allowFullScreen />
            ) : (
              <video src={video} controls />
            )}
          </div>
          <form action={removeProductVideoAction}>
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="btn admin-btn-danger">
              Премахни видеото
            </button>
          </form>
        </div>
      ) : (
        <form action={setProductVideoAction} className="admin-video-form">
          <input type="hidden" name="id" value={id} />
          <label>
            <span>Линк към видео (YouTube/Vimeo)</span>
            <input name="videoUrl" placeholder="https://youtube.com/watch?v=…" />
          </label>
          <div className="admin-or">или качете файл</div>
          <label>
            <span>Видео файл (MP4/WebM)</span>
            <input type="file" name="videoFile" accept="video/*" />
          </label>
          <button className="btn btn-primary" type="submit">
            Запази видео
          </button>
        </form>
      )}
    </div>
  );
}
