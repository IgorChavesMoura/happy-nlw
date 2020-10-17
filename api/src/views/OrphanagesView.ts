import Orphanage from '../models/Orphanage';

import ImagesView from './ImagesView';

export default {

    render(orphanage: Orphanage) {
        
        return {
            
            ...orphanage,
            images: ImagesView.renderMany(orphanage.images)


        }

    },

    renderMany(orphanages: Orphanage[]) {

        return orphanages.map(orphanage => this.render(orphanage));

    }


};