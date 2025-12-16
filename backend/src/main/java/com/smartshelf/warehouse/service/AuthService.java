package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.dto.*;
import com.smartshelf.warehouse.entity.User;
import com.smartshelf.warehouse.repository.UserRepository;
import com.smartshelf.warehouse.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = mapToDTO(user);
        return new AuthResponse(token, userDTO);
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCompanyName(request.getCompanyName());
        user.setContactNumber(request.getContactNumber());
        user.setWarehouseLocation(request.getWarehouseLocation());

        // Map role string to enum
        String roleStr = request.getRole().toUpperCase().replace("-", "_");
        if (roleStr.equals("WAREHOUSE_MANAGER")) {
            user.setRole(User.Role.WAREHOUSE_MANAGER);
        } else if (roleStr.equals("ADMIN")) {
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.USER);
        }

        userRepository.save(user);

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());
        UserDTO userDTO = mapToDTO(user);

        return new AuthResponse(token, userDTO);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setCompanyName(user.getCompanyName());
        dto.setContactNumber(user.getContactNumber());
        dto.setRole(formatRoleForFrontend(user.getRole()));
        dto.setWarehouseLocation(user.getWarehouseLocation());
        return dto;
    }

    private String formatRoleForFrontend(User.Role role) {
        if (role == User.Role.WAREHOUSE_MANAGER) {
            return "Warehouse Manager";
        }
        return role.name().charAt(0) + role.name().substring(1).toLowerCase();
    }
}
