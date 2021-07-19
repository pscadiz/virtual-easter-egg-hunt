import { useRouter } from 'next/router';
// import { getAllLinks, getLinkById } from '@/lib/db-admin';
import { getGameConfig, getTheEgg, getLinkById } from '@/lib/db';
import Header from '@/components/Header';
import { eggs, eggX } from '@/data/images';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

// export async function getStaticProps(context) {
//   let link = null;

//   const siteId = context.params.eggId;
//   const game = await getGameConfig();

//   if (game.start) {
//     link = await getLinkById(siteId);
//   }

//   return {
//     props: {
//       link: link
//     }
//   };
// }

// export async function getStaticPaths() {
//   const { links } = await getAllLinks();

//   const paths = links.map((link) => ({
//     params: {
//       eggId: link.id.toString()
//     }
//   }));

//   return {
//     paths,
//     fallback: false
//   };
// }

export async function getServerSideProps(context) {
  let link = null;

  const siteId = context.params.eggId;
  const game = await getGameConfig();

  if (game.start) {
    link = await getLinkById(siteId);
  }

  return {
    props: {
      link: link
    }
  };
}

export default function GetTheEggPage({ link }) {
  const { user } = useAuth();
  const [image, setImage] = useState();
  const router = useRouter();

  useEffect(() => {
    setImage(eggs[Math.floor(Math.random() * eggs.length)]);
  }, []);

  if (!user) {
    return (
      <>
        <Header />
        <div className='flex flex-col items-center justify-center space-y-6 full-screen layout'>
          <h2>You are not logged in</h2>
        </div>
      </>
    );
  }

  if (!link) {
    return (
      <>
        <Header />
        <div className='flex flex-col items-center justify-center space-y-6 full-screen layout'>
          <h2>The game has not been started</h2>
        </div>
      </>
    );
  }

  const eggAvailable = (
    <>
      <h1>This egg is still available!</h1>
      <div className='flex flex-col items-center'>
        <img src={image} alt='egg' className='img' />
        <a
          className='text-gray-500 underline'
          href='https://www.freepik.com/vectors/design'
        >
          Designed by freepik
        </a>
      </div>
    </>
  );

  const eggNotAvailable = (
    <>
      <div className='text-center'>
        <h2>The egg has been taken by</h2>
        <h3>{link.name}</h3>
        <i class='text-sm text-gray-400 px-0 py-0 m-0'>
          click x button to close
        </i>
      </div>
      <div className='flex flex-col items-center '>
        <img src={eggX} alt='egg' className='img' />
        <div>
          Designed by{' '}
          <a
            href='https://www.flaticon.com/authors/pixel-perfect'
            title='Pixel perfect'
            className='text-gray-500 underline'
          >
            Pixel perfect
          </a>{' '}
          from{' '}
          <a
            href='https://www.flaticon.com/'
            title='Flaticon'
            className='text-gray-500 underline'
          >
            flaticon
          </a>
        </div>
      </div>
    </>
  );

  const handleGetTheEgg = async () => {
    const data = {
      id: link.id,
      user: { id: user.uid, name: user.name, photoUrl: user.photoUrl }
    };

    const res = await getTheEgg(data);
    if (res) {
      router.push('/egg/successful');
    } else {
      router.push('/egg/failed');
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center space-y-4 full-screen layout'>
        {link.taken ? eggNotAvailable : eggAvailable}
        <div>
          <button
            className='text-lg btn disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={link.taken}
            onClick={handleGetTheEgg}
          >
            Get the egg!
          </button>
        </div>
      </div>
    </>
  );
}
