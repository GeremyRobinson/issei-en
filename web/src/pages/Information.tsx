import { useEffect } from "react";
import { Link } from "react-router";
import "./Information.css";

export default function Information() {
  useEffect(() => {
    document.title = "ISSEI—EN";
  }, []);
  return (
    <section className="info grid">
      <div className="info-about">
        <p>
          ISSEI—EN® is a wholesale distributor of high-grade matcha and Japanese tea. We source exclusively from Japan,
          partnering only with producers whose standards favor control and consistency over scale.
        </p>
        <div className="blank" />
        <p>
          We believe our role is simply to be the curator. We don't embellish; we allow the qualities of the season, region,
          and cultivar to speak for themselves. Because our sourcing is direct and our category is narrow by design, every
          product is evaluated against our own standards, and whats selected is both comprehensive and deliberate.
        </p>
      </div>
      <div className="info-contact">
        <div className="lv">
          <span>Contact</span>
          <a href="mailto:info@issei-en.com">info@issei-en.com</a>
        </div>
        <div className="lv">
          <span>Follow</span>
          <a href="https://instagram.com/issei__en" target="_blank" rel="noreferrer">
            @issei__en
          </a>
        </div>
        <div className="blank" />
        <div className="lv">
          <span>Legal</span>
          <span>
            The site is making use of cookies, check the{" "}
            <Link to="/terms" className="u">
              Terms &amp; Conditions
            </Link>{" "}
            for more details.
          </span>
        </div>
      </div>
      <figure className="info-image">
        <img src="/images/field.webp" alt="Rows of shaded tea bushes on a hillside" />
      </figure>
    </section>
  );
}
