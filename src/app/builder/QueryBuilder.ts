import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    constructor(
        public modelQuery: Query<T[], T>,
        public query: Record<string, unknown>,
    ) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm: string = (this?.query?.searchTerm as string) || '';

        // {email: {$regex: 'rav', $options: 'i'}}

        /**
         * { $or : [
         *          {email: {$regex: 'rav', $options: 'i'}}
         *          {'name.firstName': {$regex: 'rav', $options: 'i'}}
         *      ]
         * }
         */
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(
                    (field) =>
                        ({
                            [field]: {
                                $regex: searchTerm,
                                $options: 'i',
                            },
                        }) as FilterQuery<T>,
                ),
            });
        }
        return this;
    }

    filter() {
        const queryObj: Record<string, unknown> = { ...this?.query }; //copy
        const excludeFields: Array<string> = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
        ];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }

    sort() {
        const sort: string = (this?.query?.sort as string) || '-createdAt';
        const sortWithSpace: string = sort?.split(',')?.join(' ');
        this.modelQuery = this.modelQuery.sort(sortWithSpace);
        return this;
    }

    paginate() {
        const page: number = parseInt(this?.query?.page as string) || 1;
        const limit: number = parseInt(this?.query?.limit as string) || 0;
        const skip: number = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    fields() {
        const fields: string = (this?.query?.fields as string) || '-__v';
        const fieldsWithSpace: string = fields?.split(',')?.join(' ');
        this.modelQuery = this.modelQuery.select(fieldsWithSpace);
        return this;
    }

    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const totalData =
            await this.modelQuery.model.countDocuments(totalQueries);
        const limit: number = parseInt(this?.query?.limit as string) || 0;
        const page: number =
            parseInt(this?.query?.page as string) && limit
                ? parseInt(this?.query?.page as string)
                : 1;

        const totalPage =
            !Math.ceil(totalData / limit) ||
            Math.ceil(totalData / limit) === Infinity
                ? 1
                : Math.ceil(totalData / limit);

        return {
            page,
            limit,
            totalData,
            totalPage,
        };
    }
}

export default QueryBuilder;
