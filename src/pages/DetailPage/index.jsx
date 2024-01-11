import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';
import DamageModal from '../../components/DamageModal';
const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);
  //const [pokemonIds, setPokemonIds] = useState();
  const params = useParams();
  const renderCountRef = useRef(0);
  const [value, setValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // id로 Route에서 지정해줬기 때문에 id로 들어감
  const pokemonId = params.id;
  //console.log(pokemonId);
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  useEffect(() => {
    fetchPokemonData();
  }, []);

  useEffect(() => {
    //종속성 배열이 없으면 어떤 state가 변경되면 useEffect가 실행된다.
    renderCountRef.current++;
    console.log('rendered count : ', renderCountRef.current);
  });

  const fetchPokemonData = async () => {
    const url = `${baseUrl}/${pokemonId}`;
    try {
      const { data: pokemonData } = await axios.get(url);
      //console.log(pokemonData);
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities } =
          pokemonData;
        //console.log(name, id, types, weight, height, stats, abilities);
        //console.log(id);
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
        //console.log('nextAndPreviousPokemon', nextAndPreviousPokemon);
        //console.log(abilities);
        console.log(formatPokemonAbilities(abilities));

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            //포켓몬 타입에 대한 Damage Relations 상세 호출
            const type = await axios.get(i.type.url);
            //console.log(type);
            return type.data.damage_relations;
          }),
        );

        const formmatedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: fomatPokemonStats(stats),
          DamageRelations: DamageRelations,
          types: types.map((type) => type.type.name),
        };
        setPokemon(formmatedPokemonData);
        setIsLoading(false);
        //setPokemonIds(pokemonId);
        console.log(formmatedPokemonData);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  //배열 구조 분해 할당 가져오기
  const fomatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]) => [
    { name: 'Hit Points', baseStat: statHP.base_stat },
    { name: 'Attack', baseStat: statATK.base_stat },
    { name: 'Defence', baseStat: statDEP.base_stat },
    { name: 'Special Attack', baseStat: statSATK.base_stat },
    { name: 'Special Defense', baseStat: statSDEP.base_stat },
    { name: 'Speed', baseStat: statSPD.base_stat },
  ];

  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((ability) => ability.ability.name.replaceAll('-', ' '));
  };

  const getNextAndPreviousPokemon = async (id) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const { data: pokemonData } = await axios.get(urlPokemon);
    //console.log(pokemonData);
    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous));
    //console.log(previousResponse);
    return {
      next: nextResponse?.data.results?.[0].name,
      previous: previousResponse?.data?.results?.[0].name,
    };
  };

  if (isLoading) {
    return (
      <div
        className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}
      >
        <Loading className={'w-12 h-12 z-50 animate-spin text-slate-900'} />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>....Not Found</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;
  console.log(bg, text);

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}

        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}
        <section className="w-full flex flex-col z-20 items-center relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1">
              <Link to="/">
                <ArrowLeft className="w-6 h-8 text-zinc-200" />
              </Link>
              <h1 className="text-zinc-200 font-bold text-xl capitailize">
                {pokemon.name}
              </h1>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>
          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width="100%"
              height="auto"
              loading="lazy"
              alt={pokemon.name}
              className={'object-contain h-full'}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
        <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* 포켓몬 타입 */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>

          <h2 className={`text-base font-semibold ${text}`}>정보</h2>
          <div className="flex w-full items-center justify-between max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}kg
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className="text-sm flex mt-1 gap-2 justify-center text-zinc-200 capitalize"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
          <div className="w-full">
            <table>
              <tbody>
                {pokemon.stats.map((stat) => (
                  <BaseStat
                    key={stat.name}
                    valueStat={stat.baseStat}
                    nameStat={stat.name}
                    type={pokemon.types[0]}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {/* {pokemon.DamageRelations && (
            <div className="w-10/12">
              <h2 className={`text-base text-center font-semibold ${text}`}>
                <DamageRelations damages={pokemon.DamageRelations} />
              </h2>
              데미지
            </div>
          )} */}
        </section>
        {isModalOpen && (
          <DamageModal
            setIsModalOpen={setIsModalOpen}
            damages={pokemon.DamageRelations}
          />
        )}
      </div>
    </article>
  );
};

export default DetailPage;
