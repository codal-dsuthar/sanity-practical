export default function SideBySideIcons() {
  return (
    <div className="-mt-16 group relative flex gap-0">
      <div className="group-hover:-translate-x-5 z-10 flex aspect-square h-32 w-32 translate-x-2 transform items-center justify-center rounded-full border-4 border-white bg-white transition-all duration-300 group-hover:scale-110">
        <svg
          aria-labelledby="side-a-title"
          className="w-full transition duration-300"
          fill="none"
          role="img"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="side-a-title">Abstract brand mark</title>
          <circle
            className="text-brand"
            cx="200"
            cy="200"
            fill="currentColor"
            r="200"
          />
          <g clipPath="url(#a)">
            <path
              className="text-black"
              d="m309.057 231.286-8.581-14.931-41.503 25.277 46.098-58.689 6.969-4.09-1.725-2.59 3.167-4.046-14.546-12.107-6.659 8.484-134.391 78.626 49.688-59.752 92.549-50.729-8.793-16.997-50.409 27.62 24.823-29.832L251.523 105l-55.866 67.174-55.484 30.429 42.479-56.158 26.618-13.854-8.453-17.186-77.551 40.368 21.148-27.984-14.772-11.831L85 175.041l.693.553 8.34 16.982 49.49-25.772-45.108 59.621 7.393 5.923 4.397 8.498 52.105-28.566-57.378 69.008 14.221 12.529 2.855-3.434 138.421-81.246-45.957 58.53.75.625-.071.044 9.528 16.575 61.124-37.239-23.536 37.981L278.042 296l37.475-60.465-6.46-4.249Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path
                d="M0 0h230.517v191H0z"
                fill="#fff"
                transform="translate(85 105)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 scale-50 font-bold text-4xl text-black opacity-0 transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
        +
      </div>
      <div className="-translate-x-2 flex aspect-square h-32 w-32 transform items-center justify-center rounded-full border-4 border-white transition-all duration-300 group-hover:translate-x-5 group-hover:scale-110">
        <svg
          aria-labelledby="side-b-title"
          className="w-full transition duration-300"
          fill="none"
          role="img"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="side-b-title">Monogram within circular badge</title>
          <mask
            height="180"
            id="mask0_408_139"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
            width="180"
            x="0"
            y="0"
          >
            <circle cx="90" cy="90" fill="black" r="90" />
          </mask>
          <g mask="url(#mask0_408_139)">
            <circle cx="90" cy="90" fill="black" r="90" strokeWidth="6" />
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
              fill="url(#paint0_linear_408_139)"
            />
            <rect
              fill="url(#paint1_linear_408_139)"
              height="72"
              width="12"
              x="115"
              y="54"
            />
          </g>
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_408_139"
              x1="109"
              x2="144.5"
              y1="116.5"
              y2="160.5"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint1_linear_408_139"
              x1="121"
              x2="120.799"
              y1="54"
              y2="106.875"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
