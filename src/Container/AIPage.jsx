import React, {  useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { useForm } from "react-hook-form";
import { CiSettings } from "react-icons/ci";
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import {  toast } from 'react-toastify';
import { FaMicrophone } from "react-icons/fa";
import ClientIcon from '../assets/images/client.png'
import SalesPersonIcon from '../assets/images/support.png'
import { CiPlay1,CiPause1  } from "react-icons/ci";
import UseSpeechRecognition from "../Components/speechRecognition.jsx";
import { useSpeechSynthesis } from 'react-speech-kit';
import useGeminiTextGen from "../Components/aiRequest.jsx";
// lottieflow animated icons 
import Notifier from "../Components/notifier.jsx";
// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const AIPage = ({isAuthenticated}) => {
    const {register,formState,getValues} = useForm({
        defaultValues : {
            'ConfigurationDescription' : `Salesperson Information
                Name: John Doe
                Position: Senior Sales Representative
                Contact Information:

                Phone: (123) 456-7890

                Email: john.doe@example.com

                LinkedIn: linkedin.com/in/johndoe-sales

                Region/Area Covered: Northeast USA
                Specializations: B2B Sales, Enterprise Solutions

                Products/Services Sold
                Product Name: Cloud-Based CRM Software

                Key Features:

                AI-driven customer insights

                Automated sales pipelines

                Real-time analytics

                Target Clients: Mid-sized to large enterprises

                Product Name: Cybersecurity Suite

                Key Features:

                End-to-end encryption

                24/7 threat monitoring

                Compliance management (GDPR, HIPAA)

                Target Clients: Financial institutions, healthcare providers

                Service Name: IT Consulting & Implementation

                Scope: Custom software integration, staff training, post-sale support

                Company Details
                Company Name: TechSolutions Inc.
                Industry: Information Technology & Software
                Headquarters: San Francisco, CA
                Year Founded: 2010
                Key Clients: Fortune 500 companies, government agencies
                Company USP:

                "Delivering scalable, secure, and innovative tech solutions since 2010."

                Awards: Best SaaS Provider 2023 (TechAwards)

                Website: www.techsolutions.com

                Additional Notes
                Salesperson’s Achievements:

                Exceeded annual quota by 150% in 2023.

                Winner of "Top Performer" award for Q1 2024.

                                            Sales Approach: Consultative selling, long-term relationship building.`         
        },
        mode : 'all'
    })
    const {
        RecordedHooktext,
        setRecordedHooktext,
        isListening,
        startRecording,
        stopRecording,
    } = UseSpeechRecognition();
    const { response, loading, error, generateText } = useGeminiTextGen()
    const {errors} = formState
    const db = useSelector((state) => state.auth.user)  
    const UserEmail  = db != null ? db.email : 'gestuser@gmail.com'
    const ChatLogRef = useRef(null)
    const [IsLoading,SetIsLoading] = useState(false)
  
    const [MikeContainer,SetMikeContainer] = useState({
        'isRecording' : false
    })
    const [TTSConfigurations,SetTTSConfigurations] = useState({
        rate : 1.3, // Speed 
        pitch : 1, // Pitch
        volume : 1,
        voice : 2
    })
    const {speak, cancel, speaking, supported, voices} = useSpeechSynthesis()
    const Theme = useSelector((state)=> state.auth.Theme)  
    const [ShowAdvancedConfigurations,SetShowAdvancedConfigurations] = useState(false)
    const [Reload,SetReload] = useState(false)
    const [Chatlist,SetChatlist] = useState([])
    const AIConfigurationText = {
          role: 'user',
          parts: [{ text :`
                    You are an AI coach for a human salesperson.
                    You will be given a statement from a prospect.
                    Your task is to suggest what the salesperson should say next.
                    Your replies must be human-like, helpful, and gently persuasive. Apply techniquest from sales knowladge like those of Jordan Belfort.
                    Bellow is a detailed information of how you've got to help the sales person in the sales call: '
                        Opening the Call (First 10 Seconds)
                        Goal: Grab attention, build rapport.

                        Key Tactics:
                        Ask a rhetorical question or make a bold statement (e.g., "What if I told you there’s a way to double your leads in 30 days?").
                        Mirror the prospect’s energy (match their pace, tone, and language).

                        2. Building Rapport (30 Seconds – 1 Minute)
                        Goal: Establish trust and lower resistance.
                        Key Tactics:

                        Use "pattern interrupts" (unexpected comments/questions to break their scripted "no" response).

                        Find common ground ("You’re based in New York? I grew up there!").

                        Label their state (e.g., "Sounds like you’ve been burned by bad salespeople before…").

                        3. Qualifying the Prospect (1–3 Minutes)
                        Goal: Determine if they’re a good fit (time, budget, authority, need).

                        Key Questions:

                        "Who currently handles [problem your product solves]?" (Authority)

                        "What’s your budget for solving this?" (Budget)

                        "If we find a solution, how soon could you move forward?" (Timing)

                        4. Identifying Pain Points (3–5 Minutes)
                        Goal: Uncover frustrations to position your product as the solution.

                        Key Tactics:

                        Ask probing questions (e.g., "What’s the biggest challenge with your current system?").

                        Use emotional amplification (make their pain feel worse—*"So this costs you $10K/month in lost revenue?"*).

                        5. Presenting the Solution (5–10 Minutes)
                        Goal: Align your product’s benefits with their pain points.

                        Key Tactics:

                        Looping: Tie features to their needs (e.g., "You said X is a problem—our Y feature fixes that.").

                        Visual storytelling: Paint a picture of their life after buying ("Imagine cutting your workload in half…").

                        Three-Tens: Describe the product so vividly they can see, feel, and touch it.

                        6. Handling Objections (Ongoing)
                        Goal: Remove mental barriers to the sale.

                        Key Tactics:

                        Feel, Felt, Found: "I get why you’d feel that way. Others felt the same until they found…"

                        Presumptive Assumption: Act as if they’ve already bought ("When we implement this, you’ll notice…").

                        7. Closing the Deal (Final 2–5 Minutes)
                        Goal: Get a "yes" without pressure.

                        Key Tactics:

                        Alternative Close: "Would you prefer the basic or premium package?"

                        Sharp Angle Close: "If I can fix [objection], will you sign today?"

                        Urgency: "This discount expires tonight."

                        8. Post-Sale Reinforcement (After Close)
                        Goal: Prevent buyer’s remorse and set up future sales.

                        Key Tactics:

                        Congratulate them ("You made a brilliant decision!").

                        Reaffirm benefits (remind them why they bought).

                        Upsell/Cross-sell ("Since you loved X, you’ll need Y to maximize results.").
                        '
                    Avoid sounding robotic or aggressive, avoid sending multiple options just send the best one.This is the details about he salesperson and what he's selling: ${getValues('ConfigurationDescription')}
                    `}]
        }
    const [showGuid,SetshowGuid] = useState(true)
    const [RolePlaying,SetRolePlaying] = useState([
        AIConfigurationText
      ]) 


    useEffect(() => {
        if(localStorage.getItem('Chatlist') != null && localStorage.getItem('Chatlist') != 'null' && localStorage.getItem('Chatlist') != 'undefined'){
            
            var chatliststorage = JSON.parse(localStorage.getItem('Chatlist'))
            var RolePlayingstorage = JSON.parse(localStorage.getItem('RolePlaying'))
            SetChatlist(chatliststorage)
            SetRolePlaying(RolePlayingstorage)
        }

        if(localStorage.getItem('TTSConfigurations') != null && localStorage.getItem('TTSConfigurations') != 'null' && localStorage.getItem('TTSConfigurations') != 'undefined'){
            var storageComfig = JSON.parse(localStorage.getItem('TTSConfigurations'))
            SetTTSConfigurations((e) => {
                return {
                    'pitch' : storageComfig.pitch || 1,
                    'rate' : storageComfig.rate || 1.3,
                    'voice' : storageComfig.voice || 2,
                    'volume' : storageComfig.volume || 1
                }
            })
        }else{
            localStorage.setItem('TTSConfigurations',JSON.stringify(TTSConfigurations))
        }
            
            
    },[])

    useEffect(() => {
        // console.log('changes detected')
    },[Chatlist,Reload])
    
    useEffect(() => {
        if(RecordedHooktext != '' && RecordedHooktext){
            
            const dataval = {
                img : ClientIcon,
                email : 'client',
                text : RecordedHooktext
            }
            var listval = Chatlist
            listval.push(dataval)
            SetChatlist(listval)
            localStorage.setItem('Chatlist',JSON.stringify(listval))
            SetReload((e) => !e)
            // console.log('added',RecordedHooktext)
            // //making request to ai
            var clientRole = {
                role : 'user',
                parts :  [{ text : `Prospect said: "${RecordedHooktext}". What should the salesperson say next?`}],
            }
            var rolelist = RolePlaying
            rolelist.push(clientRole)
            SetRolePlaying(rolelist)
            localStorage.setItem('RolePlaying',JSON.stringify(rolelist))
            SetIsLoading(true)
            handleSubmitAiRequest(rolelist)

            setRecordedHooktext('')
        }
    },[RecordedHooktext])

 
    function ShowToast(type, message, progress = null) {
        if (type != null && message != null) {
            // If progress is provided (format: "current/total"), add it to the message
            let toastMessage = message;
            if (progress) {
                const [current, total] = progress.split('/');
                if (current && total) {
                    toastMessage = `(${current}/${total}) ${message}`;
                }
            }
    
            const toastOptions = {
                type: type,
                theme: Theme,
                position: 'top-right',
                // Add progress bar if it's a progress notification
                ...(progress && {
                    progressStyle: { backgroundColor: type === 'success' ? '#4CAF50' : 
                                    type === 'error' ? '#F44336' :
                                    type === 'warning' ? '#FFC107' : '#2196F3' },
                    autoClose: false // Keep open until manually closed for progress toasts
                })
            };
    
            // Return the toast ID so you can update or close it later
            return toast(toastMessage, toastOptions);
        }
        return null;
    }

    function TextToSpeech(text) {
        
        speak({ 
            text: text, 
            rate: TTSConfigurations.rate,
            pitch : TTSConfigurations.pitch,
            volume : TTSConfigurations.volume,
            voice : voices[TTSConfigurations.voice]
        
        })
      }

    const MapChatMesseger = Chatlist.map((items,i) => {
       
        return (
            <div  key={i} className={`dropdown bg-transparent group relative flex px-2 min-w-[150px] max-w-[95%] bg-opacity-90 w-fit my-1 mx-2 ${items.email != 'client' ? 'chat chat-end flex-row-reverse sm:dropdown-left float-right ml-auto' : 'chat chat-start flex-row sm:dropdown-right  mr-auto '}  gap-1`}>
                
                <div className="chat-image  pb-2  ">
                    <div className="w-8 mask mask-hexagon rounded-full">
                    <img
                        alt=""
                        src={items.img}
                    />
                    </div>
                </div>
                <div className={`chat-bubble w-fit max-w-[90%]   p-2 dark:bg-slate-700 bg-slate-300 text-slate-100 dark:text-slate-900 gap-2 `}>
                    <blockquote className={`w-fit  break-all  text-slate-900 dark:text-slate-200 font-mono text-sm `} > 
                        {items.text } 
                    </blockquote> 
                   
                </div> 
                <div className={` w-fit mr-auto mt-auto sticky bottom-0 flex transition-all duration-200 text-lg flex-row gap-2 ml-4 invisible group-hover:visible flex-wrap max-w-xs`} >
                        <button onClick={() =>TextToSpeech(items.text) } data-tip='Play audio' className={` tooltip tooltip-top`} >
                            <CiPlay1   className=" dark:text-slate-400 text-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer " />
                        </button>                       
                </div>  
            </div>
        )
    })
   

    const handleSubmitAiRequest = async (prompt) => {
        
        try {
          const result = await generateText(prompt) // ← awaited result
        //   console.log("AI Suggestion:", result)
          const dataval = {
                img : SalesPersonIcon,
                email : UserEmail,
                text : result
            }
            SetIsLoading(false)
            var listval = Chatlist
            listval.push(dataval)
            SetChatlist(listval)
            localStorage.setItem('Chatlist',JSON.stringify(listval))
            var clientRole = {
                role : 'model',
                parts : [{text : RecordedHooktext}]
            }
            var rolelist = RolePlaying
            rolelist.push(clientRole)
            SetRolePlaying(rolelist)
            localStorage.setItem('RolePlaying',JSON.stringify(rolelist))
            SetReload((e) => !e)
        } catch (err) {
            var mess = String(err.message)
            if(mess.match('429')){
                ShowToast('warning','Unfortunately, due to high AI usage traffic, today\'s limit has been reached. Please try again later.')
            }else {
                ShowToast('warning',err.message)
            }
           
            
          console.error()
        }finally{
            SetIsLoading(false)
           
        }
      }
      
    function ToongleListeningFunc() {
        if(MikeContainer.isRecording){
            SetMikeContainer((e) => {
                return {
                    isRecording : false
                }
            })
            stopRecording()
            
        }else if(!MikeContainer.isRecording){
            SetMikeContainer((e) => {
                return {
                    isRecording : true
                }
            })
           
            startRecording()


            
        }
    }
    function ClearChatRecord () {
        SetChatlist([])
        SetRolePlaying([AIConfigurationText])
        localStorage.setItem('RolePlaying','undefined')
        localStorage.setItem('Chatlist','undefined')
        SetshowGuid(true)
    }

    function StartConversation () { 
        var clientRole = {
            role : 'user',
            parts :  [{ text : `the salesperson has called a client. Provide what the salesperson should say at the beggining of a call? and make it short `}],
        }
        SetshowGuid(false)
        SetIsLoading(true)
        var rolelist = RolePlaying
        rolelist.push(clientRole)
        SetRolePlaying(rolelist)
        handleSubmitAiRequest(rolelist)
    }
    function EndConversation () { 
        var clientRole = {
            role : 'user',
            parts :  [{ text : `the salesperson is about to end the sales call. Provide what the salesperson should say to the client at the end of the call.? and make it short`}],
        }
        SetshowGuid(false)
        SetIsLoading(true)
        var rolelist = RolePlaying
        rolelist.push(clientRole)
        SetRolePlaying(rolelist)
        handleSubmitAiRequest(rolelist)
    }

    function ShowToast(type, message, progress = null) {
            if (type != null && message != null) {
                // If progress is provided (format: "current/total"), add it to the message
                let toastMessage = message;
                if (progress) {
                    const [current, total] = progress.split('/');
                    if (current && total) {
                        toastMessage = `(${current}/${total}) ${message}`;
                    }
                }
        
                const toastOptions = {
                    type: type,
                    theme: Theme,
                    position: 'top-right',
                    // Add progress bar if it's a progress notification
                    ...(progress && {
                        progressStyle: { backgroundColor: type === 'success' ? '#4CAF50' : 
                                        type === 'error' ? '#F44336' :
                                        type === 'warning' ? '#FFC107' : '#2196F3' },
                        autoClose: false // Keep open until manually closed for progress toasts
                    })
                };
        
                // Return the toast ID so you can update or close it later
                return toast(toastMessage, toastOptions);
            }
            return null;
    }

    const ToongleSpeechSettings = (event) => {
        const {name, value} = event.target 
        // console.log(name,value)
        SetTTSConfigurations((e) => {
            return {
                ...e,
                [name] : value
            }
        })
        localStorage.setItem('TTSConfigurations',JSON.stringify(TTSConfigurations))
    }
  
   

    return (
        <div className={` h-full  bg-transparent  py-4  overflow-x-hidden w-full overflow-y-auto relative min-w-full max-w-[100%] flex flex-col justify-between  `} >
            <Notifier />

            <section className={`  md:w-full  justify-between flex flex-col gap-2 px-1 relative overflow-x-hidden overflow-y-visible w-full rounded-sm  md:mx-auto bg-transparent dark:text-slate-100 m-auto   h-full`}>
                {/* changing <image/audio> to voice container */}
                <div className="w-full h-fit bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                        <p className="text-slate-800 dark:text-white " >Configurations</p>
                        
                        {/* Settings Button */}
                        <button 
                            onClick={() => SetShowAdvancedConfigurations((e) => !e)} 
                            className="ml-auto p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Settings"
                        >
                            <CiSettings className="text-xl" />
                        </button>
                    </div>

                    {/*advaced settings container */}
                   
                    <div className={`${ShowAdvancedConfigurations ? 'flex flex-col' : 'hidden'} w-full max-w-[1000px] mx-auto gap-4 p-6 text-gray-800 dark:text-gray-200 my-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg transition-all duration-200`}>
                        {/* Description Section */}
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ConfigurationDescription">
                                Description
                            </label>
                            <div className="flex flex-col ml-3 gap-3 w-full">
                                <small className="text-xs text-gray-500 dark:text-gray-400 italic">
                                    Example: "I'm a sales rep for TechCorp selling cloud storage solutions to small businesses..."
                                </small>
                                <small className="text-xs text-gray-500 dark:text-gray-400 italic">
                                    an example is provided bellow                                
                                </small>
                                </div>
                                
                                <textarea
                                name="ConfigurationDescription"
                                placeholder="Describe yourself as a salesperson, the product you're selling, and your organization..."
                                className="w-[98%] ml-auto min-h-[120px] p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-y"
                                {...register('ConfigurationDescription', {
                                    required: {
                                    value: true,
                                    message: 'This description is required to ensure accurate AI assistance.',
                                    }
                                })}
                                />
                                
                                {/* Error message */}
                                {errors.ConfigurationDescription && (
                                <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.ConfigurationDescription.message}
                                </span>
                                )}

                            </div>
                        </div>

                        {/* Clear Chat Section */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Chat Management
                            </label>
                            <div className="flex items-center ml-3 gap-3">
                            <button
                                data-tip="By clicking here, you will clear the chat record you have acquired with your prospect."
                                disabled={getValues('ConfigurationDescription') == ''}
                                onClick={ClearChatRecord}
                                className={`flex items-center justify-center py-2 px-4 text-sm rounded-md transition-all duration-200
                                ${getValues('ConfigurationDescription') == '' 
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 border border-red-200 dark:border-red-800 hover:shadow-sm'
                                }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear Chat History
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                This action cannot be undone
                            </span>
                            </div>
                        </div>

                       
                        {/* Text to Speech Settings */}
                        <div className="w-full p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                                <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                Text-to-Speech Settings
                            </h3>

                            <div className="space-y-5">
                                {/* Volume Control */}
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="volume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Volume
                                        </label>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Range: 0 - 1</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                        type="range"
                                        id="volume"
                                        name="volume"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={TTSConfigurations.volume}
                                        onChange={ToongleSpeechSettings}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none ring-[1px] ring-slate-300 dark:ring-slate-700 cursor-pointer accent-sky-500"
                                        />
                                        <input
                                        type="number"
                                        id="volume-input"
                                        name="volume"
                                        min="0"
                                        value={TTSConfigurations.volume}
                                        max="1"
                                        step="0.1"
                                        placeholder="0.5"
                                        onChange={ToongleSpeechSettings}
                                        className="w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                </div>

                                {/* Pitch Control */}
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="pitch" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pitch
                                        </label>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Range: 0 - 2</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                        type="range"
                                        id="pitch"
                                        name="pitch"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={TTSConfigurations.pitch}
                                        onChange={ToongleSpeechSettings}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none ring-[1px] ring-slate-300 dark:ring-slate-700  cursor-pointer accent-sky-500"
                                        />
                                        <input
                                        type="number"
                                        id="pitch-input"
                                        name="pitch"
                                        min="0"
                                        value={TTSConfigurations.pitch}
                                        max="2"
                                        step="0.1"
                                        placeholder="1.0"
                                        onChange={ToongleSpeechSettings}
                                        className="w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                </div>

                                {/* Rate Control */}
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Speech Rate
                                        </label>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Range: 0 - 10</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                        type="range"
                                        id="rate"
                                        name="rate"
                                        min="0"
                                        max="10"
                                        value={TTSConfigurations.rate}
                                        step="0.5"
                                        onChange={ToongleSpeechSettings}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none ring-[1px] ring-slate-300 dark:ring-slate-700  cursor-pointer accent-sky-500"
                                        />
                                        <input
                                        type="number"
                                        id="rate-input"
                                        name="rate"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                        value={TTSConfigurations.rate}
                                        placeholder="1.0"
                                        onChange={ToongleSpeechSettings}
                                        className="w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-md border border-sky-100 dark:border-sky-800">
                                <p className="text-xs text-sky-700 dark:text-sky-300 flex items-start gap-1">
                                <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                                <span>Tip: Adjust these settings to find the most natural sounding voice for your needs.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* main cointainer */}
                <div className={`  gap-3 w-full relative max-w-[1000px] mx-auto text-black dark:text-slate-100 mb-auto px-1  `} >
                    {/* conversation container */}
                    <div className={` bg-white/50 min-h-[500px] h-fit dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 `}  >
                        {/* guide information before a chat is started */}
                        <div className={`${Chatlist.length === 0 && showGuid == true ? 'block' : 'hidden'} p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 max-w-3xl mx-auto my-8`}>
                            <div className="text-center mb-8">
                                <svg className="w-16 h-16 mx-auto text-sky-500 dark:text-sky-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <p className="text-lg font-medium text-gray-700 dark:text-slate-200 mb-2">
                                Your AI Sales Assistant is Ready
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                Your sales conversations and AI assistance will appear here for easy access.
                                </p>
                            </div>

                            <div className="bg-sky-50 dark:bg-slate-700/30 p-5 rounded-lg border border-sky-100 dark:border-slate-600">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                How to Use Your Sales Assistant
                                </h2>

                                <ol className="space-y-3">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-slate-600 text-sky-700 dark:text-sky-300 font-medium text-xs mr-3 mt-0.5">
                                    1
                                    </span>
                                    <p className="text-gray-700 dark:text-slate-300">
                                    Provide details about yourself as a salesperson, the product you're selling, and your company.Click <span className="font-medium text-sky-600 dark:text-sky-400">'Configurations'</span> above to fill in the detials.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-slate-600 text-sky-700 dark:text-sky-300 font-medium text-xs mr-3 mt-0.5">
                                    2
                                    </span>
                                    <p className="text-gray-700 dark:text-slate-300">
                                    Click <span className="font-medium text-sky-600 dark:text-sky-400">'Provide call instruction'</span> for opening sales call techniques or <span className="font-medium text-sky-600 dark:text-sky-400">'Provide end call message'</span> for closing techniques.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-slate-600 text-sky-700 dark:text-sky-300 font-medium text-xs mr-3 mt-0.5">
                                    3
                                    </span>
                                    <p className="text-gray-700 dark:text-slate-300">
                                    Click <span className="font-medium text-sky-600 dark:text-sky-400">'Listen to client'</span> to let AI analyze the conversation and provide real-time responses.
                                    </p>
                                </li>
                                </ol>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                Start a conversation to begin your sales assistant experience
                                </p>
                            </div>
                        </div>

                        {/* chat message */}                        
                        <div ref={ChatLogRef} className={` z-20 bg-transparent flex flex-col overflow-y-auto overflow-x-hidden w-full gap-1 h-full max-h-[640px] sm:max-h-[650px] lg:max-h-[700px] transition-all duration-300 `} >
                            {MapChatMesseger}
                            <span  data-tip="Loading"  className= {` ${IsLoading ? 'loading loading-dots' : ' invisible'} transition-all duration-200 sticky top-0 tooltip cursor-pointer mx-auto my-2 bg-slate-600  loading-md `}></span>
                        
                            {/* pause button while playing audio */}
                            <div onClick={cancel}  data-tip='pause audio'  className={` ${speaking ? 'flex flex-row' :  'hidden' } tooltip cursor-pointer tooltip-top gap-3 sticky bottom-1 left-1 ring-[1px] dark:ring-amber-600 ring-red-400 bg-slate-800 dark:bg-slate-700 w-[100px] max-w-[100px] h-[40px] max-h-[40px] p-3 rounded-md `} >
                                <small className=" opacity-80 text-white my-auto h-fit dark:text-white italic" >pause</small>
                                <button  >
                                    <CiPause1    className=" text-white opacity-100 dark:text-white transition-all duration-200 cursor-pointer " />
                                </button>   
                            </div>
                        </div>
                        
                    </div> 
                    {/* button controller container  */}
                    <div className="flex flex-row gap-2 flex-wrap justify-around px-2 my-2 w-full " >
                        <button onClick={ToongleListeningFunc} data-tip='By clicking here, you allow the ai to capture what your client is saying on the call for processing purposes.' disabled={getValues('ConfigurationDescription') == ''} 
                            className={`tooltip tooltip-top  py-2 cursor-pointer group min-h-[40px] min-w-[100px] flex flex-row gap-2 disabled:cursor-not-allowed  disabled:bg-gray-600 disabled:opacity-60 px-3 disabled:shadow-transparent mx-auto mb-auto text-sm text-slate-100 rounded-md transition-all duration-300 bg-purple-600 dark:bg-purple-900 border-opacity-80 hover:border-opacity-100 shadow-xs hover:py-3 dark:text-white`}>
                            {MikeContainer.isRecording ? <p className=" my-auto" >Stop listening</p> : <p className=" my-auto" >Listen to client</p>  }
                            <div className=" relative w-fit ml-auto my-auto" >
                                <span className={` ${MikeContainer.isRecording ? '' : 'hidden'} animate-ping rounded-full max-h-3 max-w-3 -translate-y-1 absolute top-0 right-full bottom-full w-1 h-1 bg-black dark:bg-white `}></span>
                                <FaMicrophone className={` my-auto group-hover:text-red-300 `} />
                            </div>
                            
                        </button>
                        <div className=" w-fit flex flex-row flex-wrap gap-2" >
                            <button data-tip='By clicking here, you will be provided with an introduction one can use in the beggining of a sales call' disabled={getValues('ConfigurationDescription') == ''} onClick={StartConversation}  className={` tooltip tooltip-top  py-2 cursor-pointer  disabled:cursor-not-allowed  disabled:bg-gray-600 disabled:opacity-60 px-3 min-w-[80px] disabled:shadow-transparent mx-auto mb-auto text-sm text-gray-900 rounded-md  transition-all duration-300 bg-blue-400 dark:bg-blue-900 border-opacity-80 hover:border-opacity-100 shadow-xs hover:py-3 dark:text-white `}>Provide a call introduction</button>
                            <button data-tip='By clicking here, you will be provided with an ending script one can use in the end of a sales call' disabled={getValues('ConfigurationDescription') == ''} onClick={EndConversation}   className={`tooltip tooltip-top  py-2 cursor-pointer  disabled:cursor-not-allowed  disabled:bg-gray-600 disabled:opacity-60 px-3 min-w-[80px] disabled:shadow-transparent mx-auto mb-auto text-sm text-gray-900 rounded-md  transition-all duration-300 bg-red-400 dark:bg-red-900 border-opacity-80 hover:border-opacity-100 shadow-xs hover:py-3 dark:text-white `}>Provide end call message</button>
                       
                        </div>
                         <p className={` ${getValues('ConfigurationDescription') == '' ? '' : 'hidden'} w-full text-center my-2 text-xs dark:text-slate-200 `} >You need to provide configuration description to proceed. Click on 'Configurations' at the top to feed details.</p>

                    </div>

                </div>
               

            </section>

        </div>
    )
};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,null)(AIPage)
