import React from 'react'
import {NavLink} from 'react-router-dom'
const Navbar = () => {
  return (
    <nav class='bg-white border-gray-200 dark:bg-gray-900 '>
      <div class='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8'>
        <a href='https://flowbite.com/' class='flex items-center'>
          <img
            src='https://flowbite.com/docs/images/logo.svg'
            class='h-8 mr-3'
            alt='Flowbite Logo'
          />
          <span class='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            Flowbite
          </span>
        </a>
        <div class='flex md:order-2'>

          <button
            data-collapse-toggle='navbar-cta'
            type='button'
            class='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-cta'
            aria-expanded='false'
          >
            <span class='sr-only'>Open main menu</span>
            <svg
              class='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>
        <div
          class='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
          id='navbar-cta'
        >
          <ul class='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-12 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            <li>
            <li>
              <NavLink 
              to='/' 
              className={({ isActive }) => (isActive ? 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700')}
              >
                Home
              </NavLink>
            </li>
            </li>
            <li>
              <NavLink 
              to='/mint' 
              className={({ isActive }) => (isActive ? 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700')}
              >
                Mint Match ZK-POAP
              </NavLink>
            </li>
            <li>
              <NavLink 
              to='/vote' 
              className={({ isActive }) => (isActive ? 'block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' : 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700')}
              >
                Vote Player of Match
              </NavLink>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
