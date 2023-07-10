/* eslint-disable @next/next/no-img-element */
import React from 'react';

export default function NewLetter() {
  return (
    <div className="newsletter" data-v-66c30d6c data-v-66a31625>
      <div className="newsletter-wrapper" data-v-66c30d6c>
        <div className="header" data-v-66c30d6c>
          <div className="header__icon" data-v-66c30d6c>
            <img
              src="https://www.hostelworld.com/_nuxt/img/c27761c.svg"
              alt="mail"
              className="v-lazy-image"
              data-v-66c30d6c
            />
          </div>
          <div className="header__content" data-v-66c30d6c>
            <h2 className="title title-4-bld" data-v-66c30d6c>
              Join our adventurous community!
            </h2>
            <h3 className="sub-title body-1-reg" data-v-66c30d6c>
              Sign up to our newsletter for deals, inspo and other travel treats!
            </h3>
          </div>
        </div>
        <div className="input" data-v-48d388e0 data-v-66c30d6c>
          <div className="input-inner" data-v-48d388e0>
            <div className="icon-container input-prefix" data-v-48d388e0 data-v-c14fdf00>
              <svg
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                data-v-48d388e0
                data-v-c14fdf00>
                <use xlinkHref="#send" href="#send" data-v-48d388e0 data-v-c14fdf00></use>
              </svg>
            </div>
            <div className="input-wrapper" data-v-48d388e0>
              <label className="input-label" data-v-48d388e0>
                Your email address
              </label>
              <input type="text" value="" className="native-input body-1-reg" data-v-48d388e0 />
            </div>
            <div className="input-suffix" data-v-48d388e0>
              <div className="input-suffix-container" data-v-48d388e0 data-v-66c30d6c>
                <button
                  type="button"
                  aria-label="Newsletter subscription button."
                  className="btn-content icon-only"
                  data-v-958b1496
                  data-v-66c30d6c>
                  <div className="icon-container" data-v-958b1496 data-v-c14fdf00>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      data-v-958b1496
                      data-v-c14fdf00>
                      <use
                        xlinkHref="#arrow-right"
                        href="#arrow-right"
                        data-v-958b1496
                        data-v-c14fdf00></use>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
