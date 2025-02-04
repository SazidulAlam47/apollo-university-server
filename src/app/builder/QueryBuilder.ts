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
        this.modelQuery = this.modelQuery.sort(sort);
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
}

export default QueryBuilder;
