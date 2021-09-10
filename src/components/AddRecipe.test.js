import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddRecipe from '../components/AddRecipe';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

describe('AddRecipe', () => {
    const server = setupServer(
        // mock POST /recipes/
        rest.post('http://localhost/recipes/', (req, res, ctx) => {
            return res(ctx.json(
                {
                    id: '1',
                    name: 'Sandwich',
                    description: 'Serve on a plate',
                    ingredients: [
                        {
                            name: 'ham'
                        },
                        {
                            name: 'butter'
                        },
                        {
                            name: 'bread'
                        }
                    ]
                },
            ));
        }),
    )

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    const setup = (ingredientsInputName) => {
        const utils = render(<AddRecipe />);
        const nameInput = screen.getByTestId('name-input');
        const descriptionInput = screen.getByTestId('description-input');
        const ingredientsInput = utils.container.querySelector(`#${ingredientsInputName}`);
        const submitBtn = screen.getByTestId('submit-btn');

        return {
            nameInput,
            descriptionInput,
            ingredientsInput,
            submitBtn,
        };
    };

    test('renders AddRecipe component', async () => {
        const {
            nameInput,
            descriptionInput,
            ingredientsInput,
        } = setup('react-select-2-input');

        await waitFor(() => {
            expect(nameInput).toBeInTheDocument();
            expect(descriptionInput).toBeInTheDocument();
            expect(ingredientsInput).toBeInTheDocument();
        });

        expect(nameInput).toHaveTextContent('');
        expect(descriptionInput).toHaveTextContent('');
        expect(screen.getByText('Type something and press enter...')).toBeInTheDocument();

        // screen.debug();
    });

    test('renders AddRecipe component, data entered and "submit" clicked', async () => {
        const {
            nameInput,
            descriptionInput,
            ingredientsInput,
            submitBtn,
        } = setup('react-select-3-input');

        await waitFor(() => {
            expect(nameInput).toBeInTheDocument();
            expect(descriptionInput).toBeInTheDocument();
            expect(ingredientsInput).toBeInTheDocument();
        });

        // update name / description / ingredients
        fireEvent.change(nameInput, { target: { value: 'Pizza' } });
        fireEvent.change(descriptionInput, { target: { value: 'Bake in the oven' } });
        fireEvent.change(ingredientsInput, { target: { value: [{ "label": "cheese", "value": "cheese" }] } });

        // click 'Submit'
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByTestId('add-btn')).toBeInTheDocument();
        });

        expect(screen.getByTestId('success-msg')).toBeInTheDocument();

        // screen.debug();
    });
});
