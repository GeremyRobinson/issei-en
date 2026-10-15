import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { TEAS, TYPES, image, label, teaBySlug } from "../data/teas";
import { Viewer, zoomFromTile } from "../components/Viewer";
import NotFound from "./NotFound";
import "./IndexPage.css";

type Filter = "All" | (typeof TYPES)[number];

/** The Index: the filter in the first cell, then every tea. Click one to zoom in. */
export default function IndexPage() {
  const { slug } = useParams();
  const [filter, setFilter] = useState<Filter>("All");
  // keep the viewer on screen while it zooms back to its tile
  const [shown, setShown] = useState<string | null>(slug ?? null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (slug) {
      setShown(slug);
      setClosing(false);
    } else if (shown) setClosing(true);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = teaBySlug(slug);
    document.title = t ? `${label(t)} — ISSEI—EN` : "Index — ISSEI—EN";
  }, [slug]);

  if (slug && !teaBySlug(slug)) return <NotFound />;
  const teas = TEAS.filter((t) => filter === "All" || t.type === filter);

  return (
    <>
      <section className="index grid" aria-label="Index">
        <div className="index-filter">
          {(["All", ...TYPES] as Filter[]).map((f, i) => (
            <span key={f}>
              {i > 0 && ", "}
              <button className={filter === f ? "u" : undefined} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
              </button>
            </span>
          ))}
        </div>
        {teas.map((t) => (
          <Link key={t.slug} to={`/index/${t.slug}`} className="tile" data-tile={t.slug} onClick={() => zoomFromTile(t.slug)}>
            <figure className="sq">
              <img src={image(t, 1)} alt={`${t.title} powder`} />
            </figure>
            <p className="tile-cap">{label(t)}</p>
          </Link>
        ))}
      </section>
      {shown && (
        <Viewer
          teas={teas.some((t) => t.slug === shown) ? teas : TEAS}
          slug={slug ?? shown}
          closing={closing}
          onClosed={() => {
            setShown(null);
            setClosing(false);
          }}
        />
      )}
    </>
  );
}
