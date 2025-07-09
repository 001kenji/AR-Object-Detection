import React, {  useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { connect } from "react-redux";
import { FiCamera, FiStar , FiGlobe,FiSearch,FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
// lottieflow animated icons 
import Notifier from "../Components/notifier.jsx";

// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const DashboardPage = ({isAuthenticated}) => {
    const supportedLanguages = [
        'English',
        'French',
        'Spanish',
        'German',
        'Italian',
        'Portuguese',
        'Russian',
        'Chinese',
        'Japanese',
        'Arabic',
        'Hindi',
        'Bengali',
        'Urdu',
        'Turkish',
        'Vietnamese',
        'Korean',
        'Thai',
        'Polish',
        'Dutch',
        'Greek',
        'Czech',
        'Hungarian',
        'Swedish',
        'Finnish',
        'Norwegian',
        'Danish',
        'Hebrew',
        'Malay',
        'Indonesian',
        'Filipino',
        'Persian',
        'Swahili',
        'Zulu',
        'Xhosa',
        'Afrikaans',
        'Romanian',
        'Bulgarian',
        'Serbian',
        'Croatian',
        'Slovak',
        'Slovenian',
        'Ukrainian',
        'Belarusian',
        'Estonian',
        'Latvian',
        'Lithuanian',
        'Albanian',
        'Macedonian',
        'Bosnian',
        'Armenian',
        'Georgian',
        'Kazakh',
        'Uzbek',
        'Pashto',
        'Nepali',
        'Sinhala',
        'Tamil',
        'Telugu',
        'Kannada',
        'Malayalam',
        'Marathi',
        'Gujarati',
        'Punjabi',
        'Burmese',
        'Khmer',
        'Lao',
        'Mongolian',
        'Haitian Creole',
        'Yoruba',
        'Igbo',
        'Hausa',
        'Amharic',
        'Somali',
        'Maori',
        'Samoan',
        'Tongan',
        'Fijian',
        'Basque',
        'Catalan',
        'Galician',
        'Welsh',
        'Irish',
        'Scottish Gaelic',
        'Icelandic',
        'Esperanto',
        'Latin'
      ];
      
    const howitworks = [
        {
            icon: <FiCamera className="text-primary text-3xl" />,
            title: "Capture or Upload",
            desc: "Take a photo of your document or upload an existing image/PDF.",
        },
        {
            icon: <FiCheckCircle className="text-primary text-3xl" />,
            title: "OCR Processing",
            desc: "Our AI extracts text with high accuracy using advanced OCR.",
        },
        {
            icon: <FiGlobe className="text-primary text-3xl" />,
            title: "Translate & Export",
            desc: "Choose your language and get the translated text instantly.",
        },
        ]
    const DateVal = new Date()
    const [searchTerm, setSearchTerm] = useState('');
    const year = DateVal.getFullYear()
    const MapHowItworks= howitworks.map((step, index) => (
        <div key={index} className="bg-base-100 dark:bg-base-300 p-6 rounded-xl text-center shadow-sm">
            <div className="bg-base-300 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            {step.icon}
            </div>
            <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
            <p className="text-base-content/70">{step.desc}</p>
        </div>
        ))
    const TestimonialsData = [
      {
        name: 'John M.',
        role: 'Freelance Translator',
        text: 'This app saved me hours of manual translation work! The OCR accuracy is impressive, and the AI translations are surprisingly natural. I use it daily for client projects.',
        rating: 5,
        avatar: '👨‍💼'
      },
      {
        name: 'Sarah K.',
        role: 'University Student',
        text: 'As an international student, this has been a lifesaver for translating academic papers. The camera capture feature works perfectly with textbook pages.',
        rating: 4,
        avatar: '👩‍🎓'
      },
      {
        name: 'David L.',
        role: 'Business Traveler',
        text: 'I used to struggle with foreign documents during business trips. Now I just snap a photo and get instant translations. The multi-language support is fantastic!',
        rating: 5,
        avatar: '👨‍💼'
      },
      {
        name: 'Amina B.',
        role: 'Immigration Consultant',
        text: 'This tool helps me quickly translate official documents for my clients. The text extraction from scanned PDFs is remarkably accurate.',
        rating: 5,
        avatar: '👩‍⚖️'
      },
      {
        name: 'Carlos R.',
        role: 'Language Teacher',
        text: 'Great for creating bilingual teaching materials. My students love how we can capture text from any source and translate it instantly during lessons.',
        rating: 4,
        avatar: '👨‍🏫'
      },
      {
        name: 'Elena S.',
        role: 'Travel Blogger',
        text: 'Perfect for translating menus, signs, and brochures on the go. The interface is so intuitive - no learning curve at all!',
        rating: 5,
        avatar: '👩‍💻'
      },
      {
        name: 'Michael T.',
        role: 'Medical Researcher',
        text: 'Extremely useful for translating foreign medical journals. The specialized terminology handling could be improved, but overall very helpful.',
        rating: 4,
        avatar: '👨‍⚕️'
      },
      {
        name: 'Priya N.',
        role: 'Localization Specialist',
        text: 'While not perfect for professional localization work, it\'s an excellent first-pass tool that saves me significant time on rough translations.',
        rating: 4,
        avatar: '👩‍💼'
      }
    ]

    const filteredLanguages = supportedLanguages.filter(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
    const MapSupportedLanguages = filteredLanguages.map((lang) => (
        <div key={lang} className="bg-base-200 dark:bg-base-300 p-4 rounded-lg flex items-center gap-2 hover:bg-base-300 dark:hover:bg-base-100 transition-colors">
            <FiCheckCircle className="text-success" />
            <span className="font-medium">{lang}</span>
        </div>
        ));
    const MapTestimonialsData = TestimonialsData.map((testimonial, index) => (
      <div 
        key={index}
        className="bg-base-100 dark:bg-base-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{testimonial.avatar}</span>
          <div>
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-sm text-base-content/70">{testimonial.role}</p>
          </div>
        </div>
        <p className="text-base-content/90 mb-4">"{testimonial.text}"</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i}
              className={`${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-base-content/30'}`}
            />
          ))}
        </div>
      </div>
    ))


    return (
        <div className={` h-full  bg-transparent  py-4  overflow-x-hidden w-full overflow-y-auto relative min-w-full max-w-[100%] flex flex-col justify-between  `} >
            <Notifier />
            <section className={`  md:w-full  justify-between flex flex-col gap-2 px-1 relative overflow-x-hidden overflow-y-visible w-full rounded-sm  md:mx-auto  m-auto   h-full`}>
                {/* Title Section (Replaces Hero) */}
                <section className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Scan, Extract & Translate <span className="text-secondary ">Any Document</span>
                    </h1>
                </section>

                {/* How It Works */}
                <section className="bg-base-200 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {MapHowItworks}
                    </div>
                    </div>
                </section>

                {/* Supported Languages */}
                <section className="py-16 bg-base-100 dark:bg-base-200">
                  <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                      Supported Languages
                    </h2>
                    
                    {/* Search Input */}
                    <div className="relative mb-6 max-w-md mx-auto">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70" />
                      <input
                        type="text"
                        placeholder="Search languages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-10 ring-[1px] ring-slate-300 dark:ring-slate-800 focus:ring-2 focus:ring-secondary"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-error"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                    
                    {/* Languages Grid */}
                    <div className="grid grid-cols-2 max-h-[400px] overflow-y-auto md:grid-cols-4 gap-4 p-2">
                      {MapSupportedLanguages.length > 0 ? (
                        MapSupportedLanguages
                      ) : (
                        <div className="col-span-full text-center py-8 text-base-content/70">
                          <FiAlertCircle className="mx-auto text-2xl mb-2" />
                          No languages found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Testimonials (Placeholder) */}
                <section className="py-16 bg-base-200">
                    <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Trusted by Thousands
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MapTestimonialsData}
                    </div>
                    </div>
                </section>

                {/* Simplified Footer */}
                <footer className="  py-8">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                    <p>All rights reserved ©{year}, developed by <a href="https://briannjuguna.netlify.app/" className="hover:text-primary underline underline-offset-2">Brian Njuguna</a></p>
                    </div>
                </footer>
            </section>
            

        </div>
    )
};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,null)(DashboardPage)
