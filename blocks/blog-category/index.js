/**
 *  BLOCK: Blog Category
 *  ---
 *
 */

const {__} = wp.i18n
const {registerBlockType} = wp.blocks
const {Component} = wp.element
registerBlockType('tangram-detailer/blog-category', {
    title: __('Blog Category'),
    icon: 'format-aside',
    category: 'common',
    keywords: [
        __('blog'),
        __('category'),
    ],

    supports: {
        html: false,
        reusable: false,
        align: false
    },

    // Set up data model for custom block
    attributes: {
        categories: {
            type: 'array',
            selector: '',
        },
        category: {
            type: 'string',
            selector: '',
        },
    },

    edit: class BlogCategory extends Component {
        constructor() {
            super(...arguments)

            this.state = {
                categories: this.props.attributes.categories || [],
                loading: false,
            }
        }

        componentDidMount() {
            const isCategoryExists = this.props.attributes.category
            wp.apiFetch({path: '/wp/v2/categories', method: 'GET'})
                .then(cats => {
                    const categories = [...cats]

                    if(categories.length) {
                        this.props.setAttributes({
                            categories: {categories},
                            category: isCategoryExists ? isCategoryExists : categories[0].slug
                            // category: categories[0].slug
                        })
                    }
                })
                .catch(() => {this.setState({loading: false})})
        }

        showCategories() {
            const category = this.props.attributes.category;
            const categories = this.props.attributes.categories;
            return categories && categories.categories.map((cat) => {
                return (
                    <option
                        selected={category === cat.slug}
                        value={cat.slug}>{cat.name}
                    </option>)
            })
        }

        handleChange(event) {
            this.props.setAttributes({category: event.target.value})
        }

        render() {
            const {attributes, className} = this.props
            const {categories} = attributes

            if (!categories) {
                return false;
            }

            return (
                <div className={className}>
                    <h6>Select a category from your blog below:</h6>
                    <select onChange={(event) => this.handleChange(event)}>
                        {this.showCategories()}
                    </select>
                </div>
            )
        }
    },
    save: props => {
        return null
    },
    withSelect: sel => {
        console.log("SELECTED", sel);
    }
})
