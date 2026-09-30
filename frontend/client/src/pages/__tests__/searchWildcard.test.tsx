import React from 'react'
import {render,screen,waitFor,fireEvent} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {vi} from 'vitest'
import Explore from '../Explore'
import {apiClient} from '../../utils/apiClient'
vi.mock('../../utils/apiClient',()=>({apiClient:{get:vi.fn()}}))
vi.mock('../../contexts/FavouritesContext',()=>({useFavourites:()=>({has:()=>false,add:vi.fn(),remove:vi.fn()})}))
beforeEach(()=>{vi.clearAllMocks();vi.mocked(apiClient.get).mockResolvedValue({results:[],total:0})})
it('loads the public catalogue for a blank search without requiring location permission',async()=>{render(<MemoryRouter><Explore/></MemoryRouter>);await screen.findByText('Let’s try a different path.');expect(apiClient.get).toHaveBeenCalledWith('/listings?&limit=100',expect.anything())})
it('treats an explicit wildcard as a catalogue request, preserving it in the URL',async()=>{render(<MemoryRouter initialEntries={['/search?q=*']}><Explore/></MemoryRouter>);await waitFor(()=>expect(apiClient.get).toHaveBeenCalledWith('/listings?q=*&limit=100',expect.anything()))})
it('does not load map tiles until the traveller asks to see the map',async()=>{render(<MemoryRouter><Explore/></MemoryRouter>);await screen.findByText('Let’s try a different path.');expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Show map'}));expect(await screen.findByTestId('map-container')).toBeInTheDocument()})
