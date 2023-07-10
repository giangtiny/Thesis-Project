/* eslint-disable @next/next/no-img-element */
import { Logo } from '@/icons/index';
import React from 'react';

export default function DownloadApp() {
  return (
    <section
      id="download-section"
      className="download-section-wrapper"
      data-v-64f499c4
      data-v-66a31625>
      <header className="download-header" data-v-64f499c4>
        <Logo height={100} style={{ cursor: 'pointer' }} width="auto" />
        <h2 className="text-header" data-v-64f499c4>
          Download the app now.
        </h2>
      </header>
      <div className="download-links" data-v-64f499c4>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://w5az.app.link/Bp8e9Yh6Qnb"
          title="Download on App Store"
          data-v-64f499c4>
          <img
            src="https://u.hwstatic.com/appdownload_buttons/app_store/appstore_en_l.png"
            alt="Download on App Store"
            className="v-lazy-image"
            data-v-64f499c4
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://w5az.app.link/FR3wTho6Qnb"
          title="Download on Play Store"
          data-v-64f499c4>
          <img
            src="https://u.hwstatic.com/appdownload_buttons/play_store/playstore_en_l.png"
            alt="Download on Play Store"
            className="v-lazy-image"
            data-v-64f499c4
          />
        </a>
      </div>
    </section>
  );
}
