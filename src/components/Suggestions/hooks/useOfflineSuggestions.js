// @flow

import {
  useEffect,
  useState
} from "react";
import { predictImage } from "sharedHelpers/cvModel";

const useOfflineSuggestions = ( selectedPhotoUri: string ): {
  offlineSuggestions: Array<Object>,
  loadingOfflineSuggestions: boolean
} => {
  const [offlineSuggestions, setOfflineSuggestions] = useState( [] );
  const [loadingOfflineSuggestions, setLoadingOfflineSuggestions] = useState( true );

  useEffect( ( ) => {
    const predictOffline = async ( ) => {
      try {
        const predictions = await predictImage( selectedPhotoUri );
        // using the same rank level for displaying predictions in AR Camera
        // this is all temporary, since we ultimately want predictions
        // returned similarly to how we return them on web; this is returning a
        // single branch like on the AR Camera 2023-12-08
        const formattedPredictions = predictions?.reverse( )
          .filter( prediction => prediction.rank <= 40 )
          .map( prediction => ( {
            score: prediction.score,
            taxon: {
              id: Number( prediction.taxon_id ),
              name: prediction.name,
              rank_level: prediction.rank
            }
          } ) );
        setOfflineSuggestions( formattedPredictions );
        setLoadingOfflineSuggestions( false );
        return formattedPredictions;
      } catch ( e ) {
        setLoadingOfflineSuggestions( false );
        return e;
      }
    };

    if ( selectedPhotoUri ) {
      predictOffline( );
    }
  }, [selectedPhotoUri] );

  return {
    offlineSuggestions,
    loadingOfflineSuggestions
  };
};

export default useOfflineSuggestions;