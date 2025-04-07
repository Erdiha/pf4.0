import React from 'react'

const ResumeText = () => {
  return (
    <div className="bg-white text-gray-800 p-6 md:max-w-4xl mx-auto h-full overflow-auto">
      {/* Header */}

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Erdi Haciogullari</h1>
        <h2 className="text-xl">
          Software Engineer | Frontend Developer | Data Analyst
        </h2>
        <div className="flex flex-wrap justify-between mt-2">
          <a
            href="https://www.erdiha.com/"
            className="text-blue-600 hover:underline"
          >
            www.erdiha.com
          </a>
          <a
            href="https://www.linkedin.com/in/erdi-haciogullari-919246222/"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          Professional Summary
        </h2>
        <p>
          Dynamic Software Engineer and Data Scientist with a passion for
          creating responsive, adaptive, and user-friendly applications. Skilled
          in leveraging data analytics to inform design and functionality
          decisions. Seeking to contribute and grow my skills in a team
          committed to excellence.
        </p>
      </section>

      {/* Technical Skills */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          Technical Skills
        </h2>
        <ul className="list-disc ml-6">
          <li>
            <strong>Languages:</strong> C#/C++, JavaScript (TypeScript), Python,
            Dart
          </li>
          <li>
            <strong>Tech & Frameworks:</strong> React, Redux, Next.js, HTML5,
            CSS3, Tailwind, jQuery, Flutter
          </li>
          <li>
            <strong>Back-End:</strong> Node.js, SQL, NoSQL
          </li>
          <li>
            <strong>Tools:</strong> Git, Pandas, Data Analysis, Machine Learning
          </li>
          <li>
            <strong>Spoken Languages:</strong> Fluent in Turkish and English
          </li>
        </ul>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          Professional Experience
        </h2>

        <div className="mb-4">
          <h3 className="text-xl font-bold">Software Engineer</h3>
          <span className="text-gray-600">
            GraphAcademy Incorporation | May 2024 – Present
          </span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Designed and developed the company’s main web presence using React
              and Next.js, implementing all UI/UX logic, page transitions, and
              animations.
            </li>
            <li>
              Built the official website for the mobile app, incorporating
              scroll-based animations and responsive components for a smooth
              user experience.
            </li>
            <li>
              Developed voice recording features with integrated animations and
              began exploring AI-driven enhancements for voice transcription and
              interaction.
            </li>
            <li>
              Implemented AI technologies like background removal APIs (e.g.,
              remove.bg) to add advanced features to web applications.
            </li>
            <li>
              Contributed cross-platform solutions using Flutter and Dart,
              collaborating across mobile and web teams.
            </li>
            <li>
              Actively participated in AI integration research and prototyping
              for frontend use cases.
            </li>
            <li>
              Worked collaboratively with designers and engineers to ship
              scalable, performant applications.
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold">Data Management Consultant</h3>
          <span className="text-gray-600">
            Integrated Behavioral Health Research Institute | October 2023 –
            Present
          </span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Utilized Python and Pandas for data cleaning, handling incomplete
              data, and analysis.
            </li>
            <li>
              Employed DataFrame manipulation, merging, and time-series analysis
              for tailored software solutions.
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold">React Frontend Developer Intern</h3>
          <span className="text-gray-600">
            GBCS Group | July 2023 – January 2024
          </span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Led multiple front-end projects in an Agile environment,
              overseeing developers and interns for quality and timely delivery.
            </li>
            <li>
              Handled end-to-end development, including coding, testing, and
              debugging, to optimize UX and performance.
            </li>
            <li>
              Spearheaded team coordination and project planning, implementing
              best practices for high-quality standards and communication.
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold">
            Freelance Full Stack Web Developer
          </h3>
          <span className="text-gray-600">
            Glazed & Confused Mini Donuts Food Truck Company | July 2023 –
            Present
          </span>
          <ul className="list-disc ml-6 mt-2">
            <li>
              Designed and developed a full-stack website, enhancing online
              presence and customer engagement.
            </li>
            <li>Managed both front-end and back-end development tasks.</li>
          </ul>
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          Education
        </h2>
        <div className="mb-4">
          <h3 className="text-xl font-bold">Bachelor of Computer Science</h3>
          <span className="text-gray-600">
            University of California, Los Angeles | June 2022
          </span>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          Projects
        </h2>
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            <a
              href="https://www.youtube.com/watch?v=U_5BrEn1fzg"
              className="text-blue-600 hover:underline"
            >
              LetterBee
            </a>
          </h3>
          <p>Wordle-inspired immersive word guessing game for Android.</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            <a
              href="https://lift-budz.vercel.app/"
              className="text-blue-600 hover:underline"
            >
              LIFTBudz
            </a>
          </h3>
          <p>Social fitness web app connecting fitness enthusiasts.</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            <a
              href="https://thoodies.com/"
              className="text-blue-600 hover:underline"
            >
              Thoodies
            </a>
          </h3>
          <p>Recipe website and search engine for efficient user experience.</p>
        </div>
      </section>
    </div>
  )
}

export default ResumeText
