import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import PokeCard from './components/PokeCard'

function App() {

  const [pokemons, setPokemons] = useState([])

  const url = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
  /* Component가 마운트가 되고, state 초기화 되고, html이 렌더링 된 다음에 호출된다. 
    그리고, useEffect에서 state를 변경해주면 화면이 rerendering이 된다.
  */
  useEffect(() => {
    fetchPokeData();
  }, [])
  /* 배열에 아무것도 없다면, component가 마운트되고 나서 한번만 호출된다. */
  
  const fetchPokeData = async () => {
    try{
      const response = await axios.get(url);
      console.log(response.data.results);
      setPokemons(response.data.results);
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
        Input form
      </header>
      <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {pokemons.length > 0 ? (
            pokemons.map(({url, name}, index) => (
              <PokeCard key={url} url={url} name={name}/>
            ))
          ) : (
            <h2 className='font-medium text-lg text-slate-900 mb-1'>
                포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
    </article>
  )
}

export default App
