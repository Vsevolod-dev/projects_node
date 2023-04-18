import {
	Sequelize,
	Association,
	Model,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	HasManyGetAssociationsMixin,
	HasManyCreateAssociationMixin,
	NonAttribute,
	CreationAttributes,
	BelongsToGetAssociationMixin,
	ModelAttributes,
	AssociationOptions,
	HasOneGetAssociationMixin,
	ForeignKey,
} from "sequelize";

// export namespace users {
	export default interface User
		extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
		id: CreationOptional<number>;
		name: string;
		email: string;
        email_verified_at?: CreationOptional<Date>;
        remember_token?: string
        phone?: string
        password: string;
        job?: string;
        github?: string;
        instagram?: string;
        telegram?: string;

		
        // remember_token?: string
        // phone?: string
		// refreshTokenSalt: CreationOptional<string>;
		// roleId: ForeignKey<Role["id"]>;
		// domainId?: number;
		// active: boolean;
        // email_verified_at?: CreationOptional<Date>;
		// createdAt?: CreationOptional<Date>;
		// updatedAt?: CreationOptional<Date>;
		// deletedAt?: Date;
		// Tenant?: Tenant;
		/* Privileges: NonAttribute<Privilege[]>;

		addPrivileges: HasManyAddAssociationsMixin<Privilege, number>;
		getRole: HasOneGetAssociationMixin<Role>; */
	}
// }