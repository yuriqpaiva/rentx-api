import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { AppError } from "@shared/errors/AppError";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name,
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      specifications,
      id,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(
    license_plate: string
  ): Promise<Car | null | undefined> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[] | null | undefined> {
    const cars = this.cars.filter((car) => {
      if (
        car.available ??
        (brand && car.brand === brand) ??
        (category_id && car.category_id === category_id) ??
        (name && car.name === name)
      ) {
        return true;
      } else {
        return false;
      }
    });

    return cars;
  }

  async findById(id: string): Promise<Car | null | undefined> {
    return this.cars.find((car) => car.id === id);
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex((car) => car.id === id);

    if (this.cars[findIndex]?.available) {
      this.cars[findIndex].available = available;
    } else {
      throw new AppError("Car doest not exist");
    }
  }
}

export { CarsRepositoryInMemory };
