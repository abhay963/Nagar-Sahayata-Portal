// ======================================================
// ==================== ICON IMPORTS ====================
// ======================================================

// React icons used in About page
import {

  FaLandmark,

  FaStar,

  FaLightbulb,

  FaUserTie,

  FaAward,

  FaHandshake,

  FaGlobe,

  FaUsersCog,

} from "react-icons/fa";



// ======================================================
// ===================== ABOUT PAGE =====================
// ======================================================

const About = () => {

  // Debug log
  console.log(
    "📄 About Page Loaded"
  );


  return (

    <div className="
      min-h-screen
      bg-gradient-to-r
      from-green-50
      to-green-100
      py-20
      px-6
      md:px-20
      font-sans
      text-gray-900
      relative
      flex
      flex-col
      overflow-hidden
    ">

      {/* Main container */}
      <div className="
        max-w-6xl
        mx-auto
        space-y-16
        flex-grow
      ">



        {/* ====================================================== */}
        {/* ======================= HEADER ======================= */}
        {/* ====================================================== */}

        <header className="
          text-center
          max-w-4xl
          mx-auto
          space-y-6
          animate-fadeSlideDown
        ">

          {/* Main heading */}
          <h1 className="
            text-5xl
            font-extrabold
            text-green-900
          ">

            {/* Government icon */}
            <FaLandmark
              className="
                inline-block
                mr-3
                text-green-700
                animate-bounce
              "
            />

            About Nagar Sahayata Portal

          </h1>


          {/* Description */}
          <p className="
            text-lg
            text-green-700
            font-medium
            leading-relaxed
            tracking-wide
            animate-fadeInSlow
          ">

            The{" "}

            <span className="
              font-bold
              text-green-900
            ">

              Jharkhand Smart Civic Reporting & Management System

            </span>{" "}

            is a government-endorsed platform empowering citizens and municipal
            teams to{" "}

            <span className="
              text-green-800
              decoration-wavy
            ">

              collaborate efficiently

            </span>{" "}

            in creating safer, cleaner, and smarter cities.

          </p>
        </header>



        {/* ====================================================== */}
        {/* ================= MISSION & VISION =================== */}
        {/* ====================================================== */}

        <div className="
          grid
          md:grid-cols-2
          gap-12
        ">


          {/* ================= MISSION ================= */}

          <section className="
            bg-white
            rounded-lg
            shadow-lg
            p-8
            border
            border-green-200
            transition-all
            duration-500
            transform
            hover:-translate-y-2
            animate-fadeLeft
          ">

            <h2 className="
              flex
              items-center
              text-3xl
              font-bold
              text-green-800
              mb-4
              tracking-wide
            ">

              {/* Mission icon */}
              <FaStar
                className="
                  text-yellow-400
                  mr-3
                  animate-pulse
                "
              />

              Our Mission

            </h2>


            <p className="
              text-lg
              leading-relaxed
              text-gray-700
            ">

              To build a{" "}

              <strong>

                transparent, responsive, and citizen-first governance

              </strong>{" "}

              system — where civic issues are rapidly addressed, government
              efforts are recognized, and cities thrive through innovation and
              trust.

            </p>

          </section>



          {/* ================= VISION ================= */}

          <section className="
            bg-white
            rounded-lg
            shadow-lg
            p-8
            border
            border-green-200
            transition-all
            duration-500
            transform
            hover:-translate-y-2
            animate-fadeRight
          ">

            <h2 className="
              flex
              items-center
              text-3xl
              font-bold
              text-green-800
              mb-4
              tracking-wide
            ">

              {/* Vision icon */}
              <FaLightbulb
                className="
                  text-yellow-500
                  mr-3
                  animate-pulse
                "
              />

              Our Vision

            </h2>


            <p className="
              text-lg
              leading-relaxed
              text-gray-700
            ">

              Envisioning a future where{" "}

              <span className="
                text-green-900
                font-semibold
              ">

                Jharkhand leads smart governance

              </span>{" "}

              — engaging citizens actively, empowering officials with digital
              tools, and fostering clean, safe, and digitally connected urban
              communities.

            </p>

          </section>
        </div>



        {/* ====================================================== */}
        {/* ================= DEDICATED STAFF ==================== */}
        {/* ====================================================== */}

        <section className="
          bg-white
          rounded-lg
          shadow-lg
          p-10
          border
          border-green-200
          transition-all
          duration-500
          transform
          hover:-translate-y-2
          animate-fadeUp
        ">

          <h2 className="
            flex
            items-center
            text-3xl
            font-bold
            text-green-800
            mb-6
            tracking-wide
          ">

            {/* Staff icon */}
            <FaUserTie
              className="
                text-blue-600
                mr-3
                animate-pulse
              "
            />

            For Our Dedicated Staff

          </h2>


          {/* Benefits list */}
          <ul className="
            list-disc
            list-inside
            space-y-3
            text-lg
            text-gray-700
            max-w-4xl
            mx-auto
          ">

            <li>

              <strong>
                🚀 Streamlined Workflows:
              </strong>{" "}

              Centralize reports and manage tasks effortlessly from an intuitive dashboard.

            </li>


            <li>

              <strong>
                📍 Intelligent Routing:
              </strong>{" "}

              Automated issue assignment to relevant departments based on location and type.

            </li>


            <li>

              <strong>
                📊 Powerful Analytics:
              </strong>{" "}

              Monitor trends and measure response effectiveness with detailed insights.

            </li>


            <li>

              <strong>
                🤝 Transparent Progress:
              </strong>{" "}

              Foster citizen trust through visible, trackable issue resolutions.

            </li>


            <li>

              <FaUsersCog
                className="
                  inline
                  text-green-600
                  mr-1
                "
              />

              <em>

                Plus, ongoing training and support for continuous improvement.

              </em>

            </li>
          </ul>
        </section>



        {/* ====================================================== */}
        {/* ================= REWARDS SECTION ==================== */}
        {/* ====================================================== */}

        <section className="
          bg-white
          rounded-lg
          shadow-lg
          p-10
          border
          border-green-200
          transition-all
          duration-500
          transform
          hover:-translate-y-2
          animate-fadeUp
          delay-150
        ">

          <h2 className="
            flex
            items-center
            text-3xl
            font-bold
            text-green-800
            mb-6
            tracking-wide
          ">

            {/* Award icon */}
            <FaAward
              className="
                text-yellow-600
                mr-3
                animate-pulse
              "
            />

            Rewards & Recognition

          </h2>


          {/* Rewards list */}
          <ul className="
            list-disc
            list-inside
            space-y-3
            text-lg
            text-gray-700
            max-w-4xl
            mx-auto
          ">

            <li>

              🥇 Certificates for top-performing individuals and teams.

            </li>


            <li>

              🎁 Exclusive perks and incentives for departments with outstanding resolution rates.

            </li>


            <li>

              🌟 Monthly spotlight awards to celebrate exceptional dedication and impact.

            </li>

          </ul>
        </section>



        {/* ====================================================== */}
        {/* ================= COMMITMENT SECTION ================= */}
        {/* ====================================================== */}

        <section className="
          bg-white
          rounded-lg
          shadow-lg
          p-10
          border
          border-green-200
          transition-all
          duration-500
          transform
          hover:-translate-y-2
          animate-fadeUp
          delay-300
        ">

          <h2 className="
            flex
            items-center
            text-3xl
            font-bold
            text-green-800
            mb-6
            tracking-wide
          ">

            {/* Handshake icon */}
            <FaHandshake
              className="
                text-teal-600
                mr-3
                animate-pulse
              "
            />

            Our Commitment

          </h2>


          <p className="
            text-lg
            leading-relaxed
            text-gray-700
            max-w-4xl
            mx-auto
          ">

            The Government of Jharkhand pledges unwavering support to municipal
            staff by providing{" "}

            <strong>

              modern technology, continuous training, and transparent governance

            </strong>{" "}

            that bridges the gap between citizens and officials, fostering a
            culture of trust and efficiency.

          </p>
        </section>



        {/* ====================================================== */}
        {/* =================== SLOGAN SECTION =================== */}
        {/* ====================================================== */}

        <section className="
          text-center
          max-w-6xl
          mx-auto
          animate-fadeInUp
          delay-500
          px-4
        ">

          <h2 className="
            text-3xl
            font-bold
            text-green-800
            mb-12
            tracking-wide
            flex
            justify-center
            items-center
            gap-2
          ">

            {/* Globe icon */}
            <FaGlobe
              className="
                text-green-600
                animate-spin-slow
              "
            />

            Inspiring Slogan

          </h2>



          {/* Slogan cards */}
          <div className="
            grid
            sm:grid-cols-3
            gap-6
          ">

            {
              [

                "Smart Staff, Smarter Cities.",

                "Empowering Governance, Engaging Citizens.",

                "Together for a Cleaner, Safer Jharkhand.",

              ].map((slogan, idx) => (

                <div

                  key={idx}

                  className="
                    bg-white
                    shadow-md
                    border
                    border-green-200
                    rounded-lg
                    p-6
                    flex
                    flex-col
                    justify-center
                    items-center
                    transition-transform
                    duration-300
                    hover:scale-105
                    hover:shadow-xl
                    opacity-0
                  "

                  style={{

                    animation:
                      `fadeInUp 0.8s ease forwards`,

                    animationDelay:
                      `${idx * 0.3}s`,
                  }}


                  // Debug animation completion
                  onAnimationEnd={(e) => {

                    console.log(
                      `✅ Slogan animation completed: ${idx}`
                    );

                    e.currentTarget.style.opacity = 1;
                  }}
                >

                  <span className="
                    text-green-800
                    text-xl
                    font-semibold
                    italic
                    leading-relaxed
                    relative
                  ">

                    <span className="
                      text-4xl
                      text-green-400
                      absolute
                      -left-3
                      -top-4
                    ">

                      “

                    </span>


                    {slogan}


                    <span className="
                      text-4xl
                      text-green-400
                      absolute
                      -right-3
                      -bottom-4
                    ">

                      ”

                    </span>

                  </span>
                </div>
              ))
            }
          </div>
        </section>
      </div>



      {/* ====================================================== */}
      {/* ======================= FOOTER ======================= */}
      {/* ====================================================== */}

      <footer className="
        mt-20
        bg-white
        shadow-lg
        border-t
        border-green-300
      ">

        <div className="
          max-w-6xl
          mx-auto
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-4
          py-6
          px-6
          sm:px-12
        ">


          {/* Indian flag strip */}
          <div className="
            flex
            space-x-1
            w-full
            sm:w-auto
            order-2
            sm:order-1
          ">

            <div className="
              h-2
              w-10
              bg-orange-500
              rounded-tl-md
              rounded-bl-md
            "></div>

            <div className="
              h-2
              w-10
              bg-white
              border
              border-gray-300
            "></div>

            <div className="
              h-2
              w-10
              bg-green-600
              rounded-tr-md
              rounded-br-md
            "></div>

          </div>



          {/* Logo + text */}
          <div className="
            flex
            items-center
            gap-4
            order-1
            sm:order-2
          ">

            {/* Jharkhand logo */}
            <img

              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"

              alt="Government of Jharkhand"

              loading="lazy"

              className="
                h-14
                w-auto
              "


              // Image load debugging
              onError={() => {

                console.error(
                  "❌ Failed to load Jharkhand logo"
                );
              }}
            />


            {/* Footer text */}
            <span className="
              text-green-900
              font-semibold
              text-lg
              tracking-wide
              select-none
              drop-shadow-sm
              hover:text-green-700
              transition-colors
              duration-300
              cursor-default
            ">

              Government of Jharkhand

            </span>
          </div>
        </div>
      </footer>



      {/* ====================================================== */}
      {/* ==================== ANIMATIONS ====================== */}
      {/* ====================================================== */}

      <style>{`

        /* Header animation */
        @keyframes fadeSlideDown {

          0% {

            opacity: 0;

            transform: translateY(-40px);
          }

          100% {

            opacity: 1;

            transform: translateY(0);
          }
        }


        .animate-fadeSlideDown {

          animation:
            fadeSlideDown
            1s
            ease-out
            forwards;
        }



        /* Slow fade */
        @keyframes fadeInSlow {

          0% {

            opacity: 0;
          }

          100% {

            opacity: 1;
          }
        }


        .animate-fadeInSlow {

          animation:
            fadeInSlow
            2s
            ease-in
            forwards;
        }



        /* Left animation */
        @keyframes fadeLeft {

          0% {

            opacity: 0;

            transform: translateX(-40px);
          }

          100% {

            opacity: 1;

            transform: translateX(0);
          }
        }


        .animate-fadeLeft {

          animation:
            fadeLeft
            1s
            ease-out
            forwards;
        }



        /* Right animation */
        @keyframes fadeRight {

          0% {

            opacity: 0;

            transform: translateX(40px);
          }

          100% {

            opacity: 1;

            transform: translateX(0);
          }
        }


        .animate-fadeRight {

          animation:
            fadeRight
            1s
            ease-out
            forwards;
        }



        /* Bottom animation */
        @keyframes fadeUp {

          0% {

            opacity: 0;

            transform: translateY(40px);
          }

          100% {

            opacity: 1;

            transform: translateY(0);
          }
        }


        .animate-fadeUp {

          animation:
            fadeUp
            1s
            ease-out
            forwards;
        }



        /* Card animation */
        @keyframes fadeInUp {

          0% {

            opacity: 0;

            transform: translateY(30px);
          }

          100% {

            opacity: 1;

            transform: translateY(0);
          }
        }



        /* Slow rotation */
        @keyframes spinSlow {

          0% {

            transform: rotate(0deg);
          }

          100% {

            transform: rotate(360deg);
          }
        }


        .animate-spin-slow {

          animation:
            spinSlow
            8s
            linear
            infinite;
        }

      `}</style>

    </div>
  );
};


// Export page
export default About;