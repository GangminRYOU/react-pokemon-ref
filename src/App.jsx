import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import PokeCard from './components/PokeCard'


function App() {

  const [pokemons, setPokemons] = useState([])
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");  


  /* Component가 마운트가 되고, state 초기화 되고, html이 렌더링 된 다음에 호출된다. 
  그리고, useEffect에서 state를 변경해주면 화면이 rerendering이 된다.
  */
 useEffect(() => {
   fetchPokeData(true);
  }, [])
  /* 배열에 아무것도 없다면, component가 마운트되고 나서 한번만 호출된다. */
  
  const fetchPokeData = async (isFirstFetch) => {
    try{
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offsetValue}`
      const response = await axios.get(url);
      console.log(response.data.results);
      // 원래 있던 포켓몬 + 새로 들어온 포켓몬
      setPokemons([...pokemons, ...response.data.results]);
      // offset 갱신
      setOffset(offsetValue);
    } catch(error) {
      console.error(error);
    }
  }

  const handleSearchInput = async (event) => {
    setSearchTerm(event.target.value);
    if(event.target.value.length > 0) {
      try{
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${event.target.value}`);
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm
        }
        setPokemons([pokemonData]);
      }catch(e){
        //에러시 빈 배열
        setPokemons([]);
        console.error(e);
      }
    } else{
      fetchPokeData(true);
    }
  }


  return (
    <article className='pt-6'>
      <header className='flex flex-col gap-2 w-full px-4 z-50'>
        <div className='relative z-50'>
          <form className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchInput}
              className='text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center'
            />
            <button
              type='submit'
              className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'
            >
              검색
            </button>
          </form>
        </div>
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
      {/* 더보기 버튼 */}
      <div className="textCenter">
        <button
          className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg fond-bold text-white"
          onClick={() => fetchPokeData(false)}
        >
          더보기
        </button>
      </div>
    </article>
  )
}

export default App
