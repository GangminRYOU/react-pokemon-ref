import React from 'react'
import { useState, useEffect } from 'react';

const LazyImage = ({src, alt}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [opacity, setOpacity] = useState('opacity-0');

    /* loading이 바뀔때 마다 호출을 해줘야하기 때문에 의존성을 넣어야한다.
        헉.. 설마 axios는 가져올때까지 await 걸면 blocking으로 대기 해서 문제가 없는건가
        첫번째 렌더링 -> state함수 모두 호출 -> useEffect호출 
        (만약 axios가 비동기 처리되어있으면 then이면 non-blocking으로 다음 로직 수행
            await이면 동기적으로 기다렸다가 호출)
        -> 데이터가 오면 setState() 다시 호출 -> state가 변경 되었으니 rerendering
        지금 loading같은 경우에는 근데 비동기고 뭐고 없으니 그냥 주루룩 로직 수행 return 끝
        그래서 의존성을 추가해주지 않으면 isLoading이 false인 상태로 한번 호출 되고
        이후에는 그대로 투명한 상태 유지 인..듯?
    */
    useEffect(() => {
      isLoading ?setOpacity('opacity-0') : setOpacity('opacity-100');
    }, [isLoading])
    

    return (
        <>
            {isLoading && (
                <div className='absolute h-full z-10 w-full flex items-center justify-center'>
                    ....loading
                </div>
            )}
            <img
                src={src}
                alt={alt}
                width='100%'
                height='auto'
                loading='lazy'
                onLoad={() => setIsLoading(false)}
                className={`object-cotain h-full ${opacity}`}
            />
        </>
    )
}

export default LazyImage
