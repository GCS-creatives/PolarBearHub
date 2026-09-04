import { PawPrint } from './PolarBear.jsx';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lh-footer">
      <div className="lh-footer__scene" role="img" aria-label="Illustrated snowy hills with paw prints, a trail signpost reading Kind People, Bright Minds, Bold Futures, and a sleepy polar bear, under the words Home of the Polar Bears" />
      <div className="lh-footer__credits">
        <PawPrint className="lh-footer__paw" size={18} fill="#a9c6ee" />
        <p className="lh-footer__title">Lowrance Middle School Hub</p>
        <p className="lh-footer__credit">
          © {year} Grace Campbell-Sheran • A GCS Creatives Project
        </p>
      </div>
    </footer>
  );
}
