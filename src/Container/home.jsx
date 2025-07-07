import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import { IoMdAdd } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { BsMoonStarsFill } from "react-icons/bs";
import { TiThMenuOutline } from "react-icons/ti";

import { PageToogleReducer, ToogleTheme } from "../actions/types.jsx";
import AIPage from './AIPage.jsx'
import DashboardPage from "./dashboard.jsx";
import Notifier from "../Components/notifier.jsx";

import Pricing from "./ContactMe.jsx";
const Home = ({}) => {
    const { page, extrainfo } = useParams();
    const dispatch = useDispatch()
   
    const navigate = useNavigate();
    const [Theme,SetTheme] = useState(useSelector((state)=> state.auth.Theme))
    const [Page,SetPage] = useState('dashboard')
    const SideNavControler = useRef(null)
    const SelectedPage = useSelector((state) => state.auth.Page)
    const ComponentsColors = useSelector((state) => state.themes.components)
    useLayoutEffect(() => {
        dispatch({
            type : PageToogleReducer,
            payload : page
        })
        if(SelectedPage != null){
             if(SelectedPage[0] == 'AI'){
                TooglePages('AI')
            }else if(SelectedPage[0] == 'ContactMe'){
                TooglePages('ContactMe')
            }
            
         }
        else {
            SetPage(page)
        }
        var storage_theme = localStorage.getItem("data-theme")
        FuncToogleTheme(storage_theme)
        
    },[SelectedPage])
    useLayoutEffect(() => {
        var storeTheme = localStorage.getItem('theme')

        if(storeTheme == 'dark' || storeTheme == 'light'){
            dispatch({
                type : ToogleTheme,
                payload : storeTheme
            })
            SetTheme(storeTheme)
           
        }
    },[])
   
     useLayoutEffect(() => {
        // console.log('route changed')
        if(extrainfo != null && extrainfo != 'undefined'){
                SetPage(page)
                navigate(`/home/${page}`)
                // console.log(page,extrainfo)
        }
     },[page,extrainfo])

    function FuncToogleTheme (props) {
        if(props){
            
            var props_value = props == ComponentsColors.light_theme ? 'light' : 'dark'
        }else {
             var props_value = Theme == 'light' ? 'dark' : 'light'
        }
        SetTheme(props_value)
        dispatch({
            type : ToogleTheme,
            payload : props_value
        })
        localStorage.setItem('theme',props_value)
        var state_theme = props_value == 'light' ? ComponentsColors.light_theme : ComponentsColors.dark_theme
        localStorage.setItem("data-theme", state_theme)
        document.documentElement.setAttribute("data-theme", state_theme)
        
    }

    function TooglePages (props){
        dispatch({
            type : PageToogleReducer,
            payload : props
        })
        if (props != null && props == 'AI') {
            SetPage(props)
            navigate(`/home/${props}`)
        }else if (props != null && props == 'ContactMe'){
            SetPage(props)
            navigate(`/home/${props}`)
        }else if (props != null && props == 'dashboard'){
            SetPage(props)
            navigate(`/home/${props}`)
        }
       
        if(SideNavControler.current != null){
            SideNavControler.current.click()
        }
        
       
    }

    return (
        <div className={`w-full drawer ${Theme} lg:drawer-open overflow-x-hidden md:h-screen h-full relative  selection:bg-black selection:text-white selection:font-bold selection:p-1 dark:selection:bg-white  dark:selection:text-black `} >
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className={` drawer-content relative ${ComponentsColors.text_color} ${ComponentsColors.bg_color} overflow-auto h-full min-h-screen  flex flex-col `}>
                    <div className="navbar z-30 px-0  border-b-[1px] border-b-slate-500 dark:border-b-slate-600 transition-all duration-300  w-full">
                        <div className="flex-none pl-2  lg:hidden ">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost hover:bg-transparent border-none hover:shadow-xs hover:shadow-slate-400 dark:hover:shadow-slate-100 ">
                                <TiThMenuOutline 
                                    className="inline-block h-5 w-5  text-slate-700 dark:text-slate-300 stroke-current"
                                />
                            </label>
                        </div>
                        <div id="BigProppin" className="mx-2 font-sans flex-1 text-transparent bg-clip-text bg-gradient-to-br from-rose-700 dark:from-rose-600 to-amber-400 dark:to-amber-400 w-fit max-w-fit text-lg md:text-xl lg:text-2xl px-2">{import.meta.env.VITE_APP_NAME}</div>
                        
                    </div>
                    {/* Page content here */}
                    <div className={`  flex ${ComponentsColors.text_color} ${ComponentsColors.bg_color} z-40  overflow-x-hidden justify-center relative  h-full w-full min-w-full `} >
                         <Notifier />
                        {    
                        Page == 'dashboard' ? 
                        <DashboardPage className='z-30' />
                        :                  
                        Page == 'AI' ? 
                            <AIPage className='z-30' />                      
                        :
                        Page == 'ContactMe' ? 
                            <Pricing className='z-30' />
                             :
                            ''
                        }
                    </div>

                </div>
                <div className="drawer-side z-50 lg:drawer-open lg:fixed ">
                    <label  htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay transition-all duration-500"></label>
                    <ul className={` menu bg-white dark:bg-blue-950 sm:bg-transparent dark:sm:bg-transparent  border-r-[1px] lg:max-w-[250px]  border-r-slate-500 dark:border-r-slate-600 min-h-full  font-[PoppinsN]  transition-all duration-500 w-80 p-4 `}>
                        <label ref={SideNavControler} htmlFor="my-drawer-3" aria-label="open sidebar" className="btn lg:invisible btn-square btn-ghost bg-transparent border-none hover:shadow-xs hover:shadow-slate-500 dark:hover:shadow-slate-50">
                            <IoMdAdd  
                                className="inline-block rotate-45 transition-all duration-300 ml-auto h-5 w-full hover:text-rose-600 text-slate-900 dark:text-slate-300 stroke-current"
                            />                            
                        </label>
                        {/* Sidebar content here */}
                        <li onClick={()=> TooglePages('dashboard')} className= {` ${Page == 'dashboard' ? ' text-sky-600 dark:text-amber-500' : ''} hover:pl-6  transition-all hover:text-slate-50  duration-300 cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Dashboard</a></li>
                        <li onClick={()=> TooglePages('AI')} className= {` ${Page == 'AI' ? ' text-sky-600 dark:text-amber-500' : ''} hover:pl-6  transition-all hover:text-slate-50  duration-300 cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >AI</a></li>
                        <li onClick={()=> TooglePages('ContactMe')} className= {` ${Page == 'ContactMe' ? ' text-sky-600 dark:text-amber-500' : ''} hover:pl-6  transition-all hover:text-slate-50  duration-300 cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Contact Me</a></li>
                        
                        <li  className=" hover:pl-6 group transition-all hover:text-slate-50 duration-300" >
                            <a onClick={()=>FuncToogleTheme(null)} className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600 overflow-hidden"  >Theme {Theme == 'dark' ? 
                                <BsMoonStarsFill   className=" text-base animate-nonne duration-700 text-sky-300 cursor-pointer group-hover:animate-pulse" /> : 
                                <IoSunny  className=" text-lg animate-pulse duration-700 text-yellow-400 cursor-pointer group-hover:animate-spin " /> } 
                            </a> 
                        </li>
                      

                    </ul>
                </div>
        </div>
    )
   
};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps, null)(Home)
