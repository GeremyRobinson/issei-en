import { useState } from "react";
import { type Tea, image, label } from "../data/teas";
import { cart } from "../lib/cart";
import { money } from "../lib/format";
import { Profile } from "./Profile";
import { RollingText } from "./RollingText";
import "./TeaPage.css";

/** One tea, laid out as on the current site: three images, each with its text beneath. */
export function TeaPage({ tea, active }: { tea: Tea; active: boolean }) {
  const [added, setAdded] = useState(false);
  function add() {
    cart.add(tea.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="tea grid" aria-label={label(tea)}>
      <figure className="sq tea-1" data-zoom={tea.slug}>
        <img src={image(tea, 1)} alt={`${tea.title} powder`} />
      </figure>
      <figure className="sq tea-2">
        <img src={image(tea, 2)} alt={`${tea.title} prepared`} loading="lazy" />
      </figure>
      <figure className="sq tea-3">
        <img src={image(tea, 3)} alt={tea.region} loading="lazy" />
      </figure>

      <div className="tea-text tea-a">
        <p>{label(tea)}</p>
        {tea.retail && (
          <>
            <div className="blank" />
            <div className="lv">
              <span>{tea.retail.size}</span>
              <span>{money(tea.retail.price)}</span>
            </div>
            <button className="u" onClick={add}>
              <RollingText text={added ? "Added      " : "Add To Cart"} stagger={10} />
            </button>
          </>
        )}
      </div>
      <div className="tea-text tea-b">
        <div className="lv">
          <span>Type</span>
          <span>{tea.type}</span>
        </div>
        <div className="lv">
          <span>Region</span>
          <span>{tea.region}</span>
        </div>
        <div className="lv">
          <span>Cultivars</span>
          <span>{tea.cultivar}</span>
        </div>
        <p className="tea-desc">{tea.details}</p>
      </div>
      <div className="tea-text tea-c">
        <Profile tea={tea} play={active} />
        <div className="lv">
          <span>Notes</span>
          <span>{tea.notes}</span>
        </div>
      </div>
    </article>
  );
}
