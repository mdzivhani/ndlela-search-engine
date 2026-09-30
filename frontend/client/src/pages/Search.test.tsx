import React from 'react'
import {render,screen,fireEvent,waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {vi} from 'vitest'
import Explore from './Explore'
import {apiClient} from '../utils/apiClient'
vi.mock('../utils/apiClient',()=>({apiClient:{get:vi.fn()}}))
vi.mock('../contexts/FavouritesContext',()=>({useFavourites:()=>({has:()=>false,add:vi.fn(),remove:vi.fn()})}))
const item={id:'1',name:'Forest Walk',description:'A forest experience',category:'Tours',city:'Cape Town',province:'Western Cape',priceFrom:200,priceBasis:'per person',rating:0,reviewCount:0,sample:true}
function open(path='/search'){return render(<MemoryRouter initialEntries={[path]}><Explore/></MemoryRouter>)}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockResolvedValue({results:[item],total:1})})
it('renders public results with honest price and review information',async()=>{open();expect(await screen.findByText('Forest Walk')).toBeInTheDocument();expect(screen.getByText('No reviews yet')).toBeInTheDocument();expect(screen.getByText(/Sample listing/)).toBeInTheDocument()})
it('retains deep-link filters when changing sort',async()=>{open('/search?q=Cape&maxPrice=500');await screen.findByText('Forest Walk');fireEvent.change(screen.getByLabelText(/Sort/),{target:{value:'price_low'}});await waitFor(()=>expect(apiClient.get).toHaveBeenLastCalledWith(expect.stringMatching(/q=Cape&maxPrice=500&sortBy=price_low/),expect.anything()))})
it('submits destination searches and working facility filters',async()=>{open();await screen.findByText('Forest Walk');fireEvent.change(screen.getByLabelText('Destination or experience'),{target:{value:'Cape Town'}});fireEvent.click(screen.getByRole('button',{name:'Search'}));await waitFor(()=>expect(apiClient.get).toHaveBeenLastCalledWith(expect.stringContaining('q=Cape+Town'),expect.anything()));fireEvent.click(screen.getByRole('button',{name:/Filters/}));fireEvent.change(screen.getByLabelText('Facility'),{target:{value:'Parking'}});await waitFor(()=>expect(apiClient.get).toHaveBeenLastCalledWith(expect.stringContaining('facility=Parking'),expect.anything()))})
it('presents recoverable API errors',async()=>{vi.mocked(apiClient.get).mockRejectedValue(new Error('Connection unavailable'));open();expect(await screen.findByRole('alert')).toHaveTextContent('Connection unavailable');expect(screen.getByRole('button',{name:'Retry'})).toBeInTheDocument()})
it('offers a clear recovery when filters match no places',async()=>{vi.mocked(apiClient.get).mockResolvedValue({results:[],total:0});open('/search?maxPrice=1');expect(await screen.findByText('Let’s try a different path.')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Explore everything'}));await waitFor(()=>expect(apiClient.get).toHaveBeenLastCalledWith('/listings?&limit=100',expect.anything()))})
