USE tp3_vehiculos;

CREATE TABLE `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `contraseña` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
)
ENGINE = InnoDB;


CREATE TABLE `vehiculo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `marca` VARCHAR(100) NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `patente` VARCHAR(20) NOT NULL,
  `año` INT NOT NULL,
  `capacidad_carga` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `patente_UNIQUE` (`patente` ASC)
)
ENGINE = InnoDB;


CREATE TABLE `conductor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `dni` VARCHAR(20) NOT NULL,
  `licencia` VARCHAR(50) NOT NULL,
  `fecha_vencimiento_licencia` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `dni_UNIQUE` (`dni` ASC)
)
ENGINE = InnoDB;


CREATE TABLE `viaje` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehiculo_id` INT NOT NULL,
  `conductor_id` INT NOT NULL,
  `fecha_salida` DATETIME NOT NULL,
  `fecha_llegada` DATETIME NULL,
  `origen` VARCHAR(255) NOT NULL,
  `destino` VARCHAR(255) NOT NULL,
  `kilometros` DECIMAL(10, 2) NOT NULL,
  `observaciones` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_viaje_vehiculo_idx` (`vehiculo_id` ASC),
  INDEX `fk_viaje_conductor_idx` (`conductor_id` ASC),
  CONSTRAINT `fk_viaje_vehiculo`
    FOREIGN KEY (`vehiculo_id`)
    REFERENCES `vehiculo` (`id`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_viaje_conductor`
    FOREIGN KEY (`conductor_id`)
    REFERENCES `conductor` (`id`)
    ON UPDATE CASCADE
)
ENGINE = InnoDB;